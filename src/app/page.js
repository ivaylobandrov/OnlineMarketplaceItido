'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to My Next.js App</h1>
      {!user ? (
        <>
          <Link href="/login" className="text-blue-500 mb-2">
            Login
          </Link>
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </>
      ) : (
        <>
          <p className="mb-2">Welcome back!</p>
          <a href="/profile">Profile page</a>
          <a href="/product">Upload page</a>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;
