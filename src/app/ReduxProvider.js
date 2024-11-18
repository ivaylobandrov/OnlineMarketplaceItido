'use client';

import { Provider } from 'react-redux';
import store from '../store';
import { setUser } from '@/store/authSlice';
import { useEffect, useState } from 'react';

const ReduxProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(setUser({ token }));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
