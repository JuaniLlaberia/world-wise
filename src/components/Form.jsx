// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';
import { useURLPosition } from '../hooks/useURLPosition';
import Button from './Button';
import Message from './Message';
import Spinner from './Spinner';
import { useCitiesContext } from '../context/CitiesContext';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useURLPosition();
  const { uploadCity, isLoading } = useCitiesContext();

  const [isLoadingGeocoding, setIsloadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');

  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');

  const navigate = useNavigate();
  const handleGoBack = e => {
    e.preventDefault();
    navigate(-1);
  };

  useEffect(() => {
    if (!lat && !lng) return;

    const getCity = async () => {
      try {
        setGeocodingError('');
        setIsloadingGeocoding(true);
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        if (!data.countryCode)
          throw new Error('That doesnt seem to be a city.');
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        console.log(err);
        setGeocodingError(err.message);
      } finally {
        setIsloadingGeocoding(false);
      }
    };
    getCity();
  }, [lat, lng]);

  const handleSubmit = e => {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    uploadCity(newCity);
    navigate('/app/cities');
  };

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng) return <Message message='Start by clicking on the map' />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag} style={{ color: 'black' }}>
          {emoji}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        {/* <input id='date' onChange={e => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id='date'
          onChange={date => setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <Button type='back' onClick={handleGoBack}>
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
