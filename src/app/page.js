'use client';

import { useSelector } from 'react-redux';
import ProductListing from '@/components/ProductListing';
import LoginForm from '@/components/LoginForm';
import RegistrationForm from '@/components/RegistrationForm';
import NavBar from '@/components/NavBar';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
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
