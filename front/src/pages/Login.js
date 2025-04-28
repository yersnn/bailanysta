// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login }             from '../context/AuthContext';
import { API_URL }           from '../config';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401) {
        throw new Error('Invalid username or password');
      }
      if (!res.ok) {
        throw new Error('Unexpected server error');
      }

      const userData = await res.json();
      login(userData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        {error && <div className="form-error">{error}</div>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Log In'}
        </button>

        <p className="login-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}