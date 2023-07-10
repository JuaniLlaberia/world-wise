import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { useAuthContext } from '../context/FakeAuthContext';
import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');

  const { login, isAuth, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate('/app');
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <main className={styles.login}>
      <Nav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type='primary'>Login</Button>
        </div>
      </form>
    </main>
  );
}
