import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import './App.css';
import { isLoggedIn } from './context/AuthContext';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        { <Navbar />}

        <main className="app-main">
          <div className="app-content">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/"         element={<Home />} />
              <Route path="/user/:userId" element={<UserPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}