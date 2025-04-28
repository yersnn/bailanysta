import React from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn, getUser, logout } from '../context/AuthContext';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    return;
  }
  const user = getUser();
  const handleLogout = () => {
    logout();  
    navigate('/login', { replace: true });
  };
  return (
    <nav className="flex items-center justify-between py-4">
      <h1 className="text-xl font-bold">Twitter Clone</h1>
      <div>
        <Link to="/" className="mr-4">Home</Link>
        <Link to={`/user/${user.id}`} className="mr-4">Profile</Link>
        <button onClick={handleLogout} className="px-4 py-2 rounded bg-red-500 text-white">
          Logout
        </button>
      </div>
    </nav>
  );
}
