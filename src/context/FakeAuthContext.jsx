import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isAuth: true };
    case 'logout':
      return { ...state, user: null, isAuth: false };
    default:
      throw new Error('Problem with authentication.');
  }
};

const initialState = { use: null, isAuth: false };

export const AuthProvider = ({ children }) => {
  const [{ user, isAuth }, dispatch] = useReducer(reducer, initialState);

  const login = (email, password) => {
    console.log('Checking user');
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'login', payload: FAKE_USER });
  };

  const logout = () => {
    dispatch({ type: 'logout' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
