import React, { useState } from 'react';
import './App.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setError('Please enter both email and password.');
    } else {
      setError('');
      alert(`Logged in as ${username}`);
    }
  };

  return (
      <div className="center-wrapper">
        <div className="login-stack">
          <h1 className="login-main-title">Barangay Balibago Case Portal TEST IBA</h1>
          <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                style={{ marginTop: '1.5rem' }}
              />
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <div className="error">{error}</div>
              <button className="login-btn" type="submit">Log In</button>
            </form>
          </div>
        </div>
      </div>
  );
}

export default LoginPage;