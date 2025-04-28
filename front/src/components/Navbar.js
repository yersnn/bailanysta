import React, { useState, useEffect } from 'react';
import { Link, useNavigate }      from 'react-router-dom';
import { isLoggedIn, getUser, logout } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    document.documentElement.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loggedIn = isLoggedIn();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Bailanysta</h1>
      <div className="nav-links">
        {loggedIn && <Link to="/" className="nav-link">Home</Link>}
        {loggedIn && <Link to={`/user/${user.id}`} className="nav-link">Profile</Link>}
        {loggedIn && (
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        )}
        <button onClick={toggleTheme} className="btn theme-toggle">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}