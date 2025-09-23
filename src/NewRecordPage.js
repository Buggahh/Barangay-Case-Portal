import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./NewRecordPage.css";

function NewRecordPage({ onLogout }) {
  const [dateTime, setDateTime] = useState(new Date());
  const [role, setRole] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("loggedInUsername") || "");

  // Table state
  const [rows, setRows] = useState([
    { type: "main", date: "", time: "", remarks: "" }
  ]);

  // Case Status state
  const [statusDate, setStatusDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusOptions = [
    "On Going / Pending",
    "Settled Amicably",
    "Dismissed",
    "Withdrawn",
    "Referred to Other Office",
    "Certificate to File Action"
  ];

  // Repudiated state
  const [repudiated, setRepudiated] = useState("");
  const [mainPoint, setMainPoint] = useState("");

  // Execution state
  const [execution, setExecution] = useState("");
  const [executionDate, setExecutionDate] = useState("");
  const [executionReason, setExecutionReason] = useState("");

  // Separate state for each proceedings table
  const [mediationRows, setMediationRows] = useState([
    { date: "", time: "", remarks: "" }
  ]);
  const [conciliationRows, setConciliationRows] = useState([
    { date: "", time: "", remarks: "" }
  ]);
  const [arbitrationRows, setArbitrationRows] = useState([
    { date: "", time: "", remarks: "" }
  ]);

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

  // Handle cell changes
  const handleCellChange = (idx, field, value) => {
    setRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  // Handlers for each table
  const handleMediationChange = (idx, field, value) => {
    setMediationRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };
  const handleConciliationChange = (idx, field, value) => {
    setConciliationRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };
  const handleArbitrationChange = (idx, field, value) => {
    setArbitrationRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  // Add new row
  const handleAddRow = () => {
    setRows(rows => [
      ...rows,
      { type: "sub", date: "", time: "", remarks: "" }
    ]);
  };
  const handleAddMediation = () => {
    setMediationRows(rows => [
      ...rows,
      { date: "", time: "", remarks: "" }
    ]);
  };
  const handleAddConciliation = () => {
    setConciliationRows(rows => [
      ...rows,
      { date: "", time: "", remarks: "" }
    ]);
  };
  const handleAddArbitration = () => {
    setArbitrationRows(rows => [
      ...rows,
      { date: "", time: "", remarks: "" }
    ]);
  };

  return (
    <div>
      {/* Header */}
      <header className="header-container">
        {/* Top Row */}
        <div className="header-top-row">
          <div className="header-top-left">
            <img src="#" alt="Logo" className="header-logo" />
            <div className="header-top-titles">
              <div className="header-city">City of Mandaluyong</div>
              <div className="header-underline" />
              <div className="header-barangay">BARANGAY HIGHWAY HILLS</div>
            </div>
          </div>
          <div className="header-top-right">
            <span className="header-admin">
              {username ? `Username: ${username}` : ""}
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
            <Link to="/" className="header-link">Home</Link>
            <Link to="/Dashboard" className="header-link">Dashboard</Link>
            <Link to="/Database" className="header-link">Database</Link>
            <Link to="/New-Record" className="header-link">New Record</Link>
            <Link to="/Reports" className="header-link">Reports</Link>
          </nav>
        </div>
      </header>

      {/* Case Management - Mediation Proceedings */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Case Management</h1>
        <div className="newrecord-table-row">
          <table className="newrecord-table">
            <tbody>
              <tr>
                <td></td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Date</td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Time</td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Remarks</td>
              </tr>
              {mediationRows.map((row, idx) => (
                <tr key={idx} style={{ position: idx === mediationRows.length - 1 ? "relative" : "static" }}>
                  <td>{idx === 0 ? "Mediation Proceedings" : ""}</td>
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={e => handleMediationChange(idx, "date", e.target.value)}
                      className="newrecord-input"
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={e => handleMediationChange(idx, "time", e.target.value)}
                      className="newrecord-input"
                    />
                  </td>
                  <td style={{ paddingLeft: "0px" }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleMediationChange(idx, "remarks", e.target.value)}
                      className="newrecord-input"
                      placeholder="Enter remarks"
                    />
                    {idx === mediationRows.length - 1 && (
                      <button
                        className="newrecord-add-btn add-btn-absolute"
                        onClick={handleAddMediation}
                        type="button"
                      >
                        + ADD
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Management - Conciliation Proceedings */}
      <div className="newrecord-main-content" style={{ borderCollapse: 'collapse', paddingTop: 0 }}>
        <div className="newrecord-table-row">
          <table className="newrecord-table">
            <tbody>
              <tr>
                <td></td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Date</td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Time</td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Remarks</td>
              </tr>
              {conciliationRows.map((row, idx) => (
                <tr key={idx} style={{ position: idx === conciliationRows.length - 1 ? "relative" : "static" }}>
                  <td>{idx === 0 ? "Conciliation Proceedings" : ""}</td>
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={e => handleConciliationChange(idx, "date", e.target.value)}
                      className="newrecord-input"
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={e => handleConciliationChange(idx, "time", e.target.value)}
                      className="newrecord-input"
                    />
                  </td>
                  <td style={{ paddingLeft: "0px" }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleConciliationChange(idx, "remarks", e.target.value)}
                      className="newrecord-input"
                      placeholder="Enter remarks"
                    />
                    {idx === conciliationRows.length - 1 && (
                      <button
                        className="newrecord-add-btn add-btn-absolute"
                        onClick={handleAddConciliation}
                        type="button"
                      >
                        + ADD
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Management - Arbitration Proceedings */}
      <div className="newrecord-main-content" style={{ borderCollapse: 'collapse', paddingTop: 0 }}>
        <div className="newrecord-table-row">
          <table className="newrecord-table">
            <tbody>
              <tr>
                <td></td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Date</td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Time</td>
                <td className="newrecord-header-cell" style={{ textAlign: "left" }}>Remarks</td>
              </tr>
              {arbitrationRows.map((row, idx) => (
                <tr key={idx} style={{ position: idx === arbitrationRows.length - 1 ? "relative" : "static" }}>
                  <td>{idx === 0 ? "Arbitration Proceedings" : ""}</td>
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={e => handleArbitrationChange(idx, "date", e.target.value)}
                      className="newrecord-input"
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={e => handleArbitrationChange(idx, "time", e.target.value)}
                      className="newrecord-input"
                    />
                  </td>
                  <td style={{ paddingLeft: "0px" }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleArbitrationChange(idx, "remarks", e.target.value)}
                      className="newrecord-input"
                      placeholder="Enter remarks"
                    />
                    {idx === arbitrationRows.length - 1 && (
                      <button
                        className="newrecord-add-btn add-btn-absolute"
                        onClick={handleAddArbitration}
                        type="button"
                      >
                        + ADD
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Case Status Section */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Case Status</h1>
        {/* Status Table */}
        <table className="case-status-table">
          <tbody>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600 }}>
                Date:&nbsp;
                <input
                  type="date"
                  value={statusDate}
                  onChange={e => setStatusDate(e.target.value)}
                  className="case-status-input"
                />
              </td>
              {statusOptions.map(option => (
                <td
                  key={option}
                  className={`case-status-cell status-btn${selectedStatus === option ? " selected" : ""}`}
                  onClick={() => setSelectedStatus(option)}
                  style={{textAlign: "center", cursor: "pointer" }}
                >
                  {option}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Status Details Table */}
        <table className="case-status-table">
          <tbody>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600, background: "#f8f8f8" }}>
                {selectedStatus && <span>{selectedStatus}</span>}
              </td>
              <td className="case-status-cell" style={{fontWeight: 600, borderBottom: '1px solid white'}}>
                Main Point of Agreement/Award:
              </td>
            </tr>
            <tr>
              <td className="case-status-cell">
                Repudiated?&nbsp;
                <span
                  className={`pill-radio${repudiated === "Yes" ? " selected" : ""}`}
                  onClick={() => setRepudiated("Yes")}
                >Yes</span>
                <span style={{ margin: "0 8px" }}>or</span>
                <span
                  className={`pill-radio${repudiated === "No" ? " selected" : ""}`}
                  onClick={() => setRepudiated("No")}
                >No</span>
              </td>
              <td
                className="case-status-cell"
                style={{ verticalAlign: "top" , paddingTop: "0px"}}>
                <input
                  type="text"
                  value={mainPoint}
                  onChange={e => setMainPoint(e.target.value)}
                  className="case-status-input"
                  placeholder="Enter main point of agreement/award"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Execution Table */}
        <table className="case-status-table">
          <tbody>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600 }}>Execution</td>
              <td className="case-status-cell">
                <span
                  className={`pill-radio${execution === "Yes" ? " selected" : ""}`}
                  onClick={() => setExecution("Yes")}
                >Yes</span>
                <span style={{ margin: "0 8px" }}>or</span>
                <span
                  className={`pill-radio${execution === "No" ? " selected" : ""}`}
                  onClick={() => setExecution("No")}
                >No</span>
              </td>
              <td className="case-status-cell">
                Date:&nbsp;
                <input
                  type="date"
                  value={executionDate}
                  onChange={e => setExecutionDate(e.target.value)}
                  className="case-status-input"
                />
              </td>
              <td className="case-status-cell">
                Reason:&nbsp;
                <input
                  type="text"
                  value={executionReason}
                  onChange={e => setExecutionReason(e.target.value)}
                  className="case-status-input"
                  placeholder="Enter reason"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NewRecordPage;