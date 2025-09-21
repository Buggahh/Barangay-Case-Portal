import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import FirestoreTest from "./FirestoreTest";
import AdminPage from "./PortalPage";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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
        // Get user data to use in alert >> const userData = querySnapshot.docs[0].data();
        localStorage.setItem("isAdminLoggedIn", "true");
        setIsAdmin(true); // Navigate to admin page
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
    return <AdminPage onLogout={handleLogout} />;
  }

  return (
      <div className="center-wrapper">
        <div className="login-stack">
          <h1 className="login-main-title">Barangay Balibago Case Portal</h1>
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
        <FirestoreTest />
      </div>
  );
}

export default LoginPage;