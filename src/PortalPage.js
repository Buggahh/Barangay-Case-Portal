import React, { useEffect, useState } from "react";
// import logo from "./logo192.png"; // Uncomment and use your logo if available

function AdminPage({ onLogout }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <img src="#" alt="Logo" className="header-logo" />
          <span className="header-title">Barangay Balibago</span>
        </div>
        <nav className="header-nav">
          <a href="#" className="header-link">Home</a>
          <a href="#" className="header-link">Create New Record</a>
          <a href="#" className="header-link">Records</a>
          <a href="#" className="header-link">Dashboard</a>
          <span className="header-admin">Admin</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </nav>
      </header>

      {/* Main Content */}
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Barangay Case Portal</h1>
        <h3>{formattedDate}</h3>
        <h4>{formattedTime}</h4>

        {/* Card Container */}
        <div className="card-container">
          <h2>Card Title</h2>
          <p>This is a sample content inside the card.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
