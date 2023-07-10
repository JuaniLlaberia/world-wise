import { useCitiesContext } from '../context/CitiesContext';
import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Spinner from './Spinner';

const CountryList = () => {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) return <Spinner />;

  const visitedCountries = cities.reduce((acc, city) => {
    if (!acc.map(el => el.city).includes(city.country)) {
      return [
        ...acc,
        { country: city.country, emoji: city.emoji, id: city.id },
      ];
    } else return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {visitedCountries.map(country => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
};

export default CountryList;
