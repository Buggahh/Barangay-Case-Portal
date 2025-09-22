import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import FirestoreTest from "./FirestoreTest";
import PortalPage from "./PortalPage";
import DatabasePage from "./DatabasePage";
import NewRecordPage from "./NewRecordPage";
import ReportsPage from "./ReportsPage";
import userIcon from './icons/user.png';
import passwordIcon from './icons/password.png';
import eyeOffIcon from './icons/eye.png';
import eyeIcon from './icons/eye-off.png';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdminLoggedIn");
    if (loggedIn === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setError('Please enter both username and password.');
      return;
    }

    // Query Firestore for a matching user
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("loggedInUsername", username); // <-- Add this line
        setIsAdmin(true);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Error logging in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAdmin(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  if (isAdmin) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<PortalPage onLogout={handleLogout} />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/new-record" element={<NewRecordPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <div className="center-wrapper">
      <div className="login-stack">
        <h1 className="login-main-title">Katarungang Pambarangay (KP) <br />Management Information System (MIS)</h1>
        <div className="login-container">
          <div className="login-title-group">
            <h2 className="login-title">Sign In</h2>
            <div className="login-subtitle">Login with your account..</div>
          </div>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="input-wrapper">
                <img
                  src={userIcon}
                  alt="User Icon"
                  className="input-icon-img"
                />
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="input-wrapper">
              <img
                src={passwordIcon}
                alt="Password Icon"
                className="input-icon-img"
              />
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <img
                src={showPassword ? eyeOffIcon : eyeIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                className="input-eye-img"
                onClick={() => setShowPassword(v => !v)}
                style={{ cursor: "pointer" }}
                tabIndex={0}
              />
            </div>
            <button className="login-btn" type="submit">LOGIN</button>
          </form>
          <div className="error">{error}</div>
        </div>
      </div>
      < FirestoreTest/>
    </div>
  );
}

export default App;