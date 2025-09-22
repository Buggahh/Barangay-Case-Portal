import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function PortalPage({ onLogout }) {
  const [dateTime, setDateTime] = useState(new Date());
  const [role, setRole] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("loggedInUsername") || "");

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user role from Firestore
  useEffect(() => {
    async function fetchRole() {
      if (!username) return;
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setRole(userData.role || "Unknown");
      } else {
        setRole("Unknown");
      }
    }
    fetchRole();
  }, [username]);

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
            <span className="header-admin">
              {username ? `Username: ${username}` : ""} {/*role && `| Role: ${role}`*/}
            </span>
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
            <a href="./DatabasePage.js" className="header-link">Database</a>
            <a href="./NewRecordPage.js" className="header-link">New Record</a>
            <a href="./ReportsPage.js" className="header-link">Reports</a>
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

export default PortalPage;
