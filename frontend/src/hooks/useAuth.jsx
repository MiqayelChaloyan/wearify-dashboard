import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { PAGES } from '../constants/pages';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchStatistikaSuccess } from '../redux/features/statistikaSlice';
import { endpoints } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await axios.get(endpoints.verifyToken, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { user } = res.data;

        console.log(res.data, '1111111111111111111111111111111111111')

        dispatch(fetchStatistikaSuccess(user.data));

        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    };

    validateToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate(PAGES.SIGN_IN);
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      logout,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);