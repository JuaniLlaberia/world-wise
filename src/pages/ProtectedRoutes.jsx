import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/FakeAuthContext';
import { useEffect } from 'react';

const ProtectedRoutes = ({ children }) => {
  const { isAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) navigate('/');
  }, [isAuth, navigate]);

  return children;
};

export default ProtectedRoutes;
