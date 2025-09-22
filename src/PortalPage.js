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
      <header className="header-container">
        {/* Top Row */}
        <div className="header-top-row">
          <div className="header-top-left">
            <img src="#" alt="Logo" className="header-logo" />
            <div className="header-top-titles">
              <div className="header-city">
                City of Mandaluyong
              </div>
              <div className="header-underline" />
              <div className="header-barangay">BARANGAY HIGHWAY HILLS</div>
            </div>
          </div>
          <div className="header-top-right">
            <span className="header-admin">Username: Admin</span> {/*Need change, check what kind of username, then put it here*/}
            <button onClick={onLogout} className="logout-btn">Sign Out</button>
          </div>
        </div>
        {/* Bottom Row */}
        <div className="header-bottom-row">
          <div className="header-bottom-left">
            <div className="header-kp">Katarungang Pambarangay (KP)</div>
            <div className="header-kp">Management Information Systems (MIS)</div>
          </div>
          <nav className="header-bottom-nav">
            <a href="#" className="header-link">Home</a>
            <a href="#" className="header-link">Dashboard</a>
            <a href="#" className="header-link">Database</a>
            <a href="#" className="header-link">New Record</a>
            <a href="#" className="header-link">Reports</a>
          </nav>
        </div>
      </header>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Barangay Case Portal</h1>
        <h3>{formattedDate}</h3>
        <h4>{formattedTime}</h4>
        <div className="card-container">
          <h2>Card Title</h2>
          <p>This is a sample content inside the card.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
