'use client';

import { Provider } from 'react-redux';
import store from '../store';
import { setUser } from '@/store/authSlice';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const ReduxProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get user data
        store.dispatch(setUser({ id: decoded.id, token })); // Dispatch setUser with user ID and token
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
