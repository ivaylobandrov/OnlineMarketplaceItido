'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import ProductListing from '@/components/ProductListing';
import LoginForm from '@/components/LoginForm';
import RegistrationForm from '@/components/RegistrationForm';
import NavBar from '@/components/NavBar';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <NavBar />
      {!user && (
        <div className="flex flex-col items-center">
          <LoginForm />
          <RegistrationForm />
        </div>
      )}
      {user && <ProductListing />}
    </div>
  );
};

export default HomePage;
