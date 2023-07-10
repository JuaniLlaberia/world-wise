import CityItem from './CityItem';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCitiesContext } from '../context/CitiesContext';

const CityList = () => {
  const { cities, isLoading } = useCitiesContext();

  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.cityList}>
      {cities.length > 1 ? (
        cities.map(city => <CityItem city={city} key={city.id} />)
      ) : (
        <Message message='Add your first adventure' />
      )}
    </ul>
  );
};

export default CityList;
