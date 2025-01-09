import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import Link from 'next/link';
import { House } from '@phosphor-icons/react';

const NavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return (
    <>
      {user && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-200 to-blue-900 text-white w-full">
          <div className="flex">
            {' '}
            <Link href={'/'}>
              <House size={40} />
            </Link>
            <p className="mb-0 font-bold pl-5 text-4xl">
              {' '}
              Welcome to the OnlineMarket place!
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/profile"
              className="hover:underline font-bold text-2xl"
            >
              Profile page
            </Link>
            <Link
              href="/product"
              className="hover:underline font-bold text-2xl"
            >
              Upload a product
            </Link>
            <Link
              onClick={handleLogout}
              className="text-white rounded transition duration-200 font-bold text-2xl"
              href={'/'}
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
