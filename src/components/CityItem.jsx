import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCitiesContext } from '../context/CitiesContext';

const formatDate = date =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

const CityItem = ({ city }) => {
  const { cityInfo, deleteCity } = useCitiesContext();

  const handleClick = e => {
    //We stop the propagation so the handler of the other btn doesnt get trigger
    e.preventDefault();
    deleteCity(city.id);
  };

  return (
    <li>
      <Link
        to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
        className={`${styles.cityItem} ${
          city.id === cityInfo?.id ? styles['cityItem--active'] : ''
        }`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>{formatDate(city.date)}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
};

export default CityItem;
