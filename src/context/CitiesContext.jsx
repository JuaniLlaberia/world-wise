import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

const CitiesContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'citiesLoaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'cityCreated':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case 'cityDeleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
      };
    case 'cityLoaded':
      return {
        ...state,
        isLoading: false,
        cityInfo: action.payload,
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error('');
  }
};

const initialState = {
  cities: [],
  isLoading: false,
  cityInfo: {},
  error: '',
};

export const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, cityInfo }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const getCities = async () => {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`http://localhost:8000/cities`);
        const data = await res.json();
        dispatch({ type: 'citiesLoaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading data...',
        });
      }
    };
    getCities();
  }, []);
  //we use the useCallback hook to preserve the function and avoid infite loops in the useEffect dependency where this function is called
  const getCity = useCallback(
    async id => {
      if (Number(id) === cityInfo.id) return;
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`http://localhost:8000/cities/${id}`);
        const data = await res.json();
        dispatch({ type: 'cityLoaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading city...',
        });
      }
    },
    [cityInfo.id]
  );

  const uploadCity = async newCity => {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`http://localhost:8000/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      dispatch({ type: 'cityCreated', payload: data });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating the new city...',
      });
    }
  };

  const deleteCity = async cityId => {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`http://localhost:8000/cities/${cityId}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'cityDeleted', payload: cityId });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting the city...',
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        cityInfo,
        getCity,
        uploadCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

export const useCitiesContext = () => useContext(CitiesContext);
