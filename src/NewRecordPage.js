import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./NewRecordPage.css";
import uploadIcon from './icons/upload.png';
import printIcon from './icons/print.png';
import editIcon from './icons/edit.png';
import submitIcon from './icons/submit.png';
import { submitNewCase } from "./SubmitCase";

function NewRecordPage({ onLogout }) {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("loggedInUsername") || "");

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
    const [ammicableRows, setAmmicableRows] = useState([
    { date: "", time: "", remarks: "" }
  ]);

  // Complainants state
  const [complainants, setComplainants] = useState([
    {
      lastname: "",
      firstname: "",
      middlename: "",
      extension: "",
      nickname: "",
      sex: "",
      birthdate: "",
      province: "",
      city: "",
      barangay: "",
      specific: "",
      contact: "",
      email: ""
    }
  ]);

  // Respondents state
  const [respondents, setRespondents] = useState([
    {
      lastname: "",
      firstname: "",
      middlename: "",
      extension: "",
      nickname: "",
      sex: "",
      birthdate: "",
      province: "",
      city: "",
      barangay: "",
      specific: "",
      contact: "",
      email: ""
    }
  ]);

  // Add state for Complainant section inputs (before return)
  const initialComplainantSection = {
    dateTimeFiled: "",
    dateOfIncident: "",
    placeOfIncident: "",
    natureOfComplaint: "",
    offenseViolation: "",
    specific: ""
  };
  const [complainantSection, setComplainantSection] = useState(initialComplainantSection);

  // Handler for Complainant section inputs
  const handleComplainantSectionChange = (field, value) => {
    setComplainantSection(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
    const handleAmmicableChange = (idx, field, value) => {
    setAmmicableRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
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
    const handleAddAmmicable = () => {
    setAmmicableRows(rows => [
      ...rows,
      { date: "", time: "", remarks: "" }
    ]);
  };

  const handleComplainantChange = (idx, field, value) => {
    setComplainants(list =>
      list.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

    const handleRespondentChange = (idx, field, value) => {
    setRespondents(list =>
      list.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddComplainant = () => {
    setComplainants(list => [
      ...list,
      {
        lastname: "",
        firstname: "",
        middlename: "",
        extension: "",
        nickname: "",
        sex: "",
        birthdate: "",
        province: "",
        city: "",
        barangay: "",
        specific: "",
        contact: "",
        email: ""
      }
    ]);
  };

  const handleAddRespondent = () => {
    setRespondents(list => [
      ...list,
      {
        lastname: "",
        firstname: "",
        middlename: "",
        extension: "",
        nickname: "",
        sex: "",
        birthdate: "",
        province: "",
        city: "",
        barangay: "",
        specific: "",
        contact: "",
        email: ""
      }
    ]);
  };

  // Submit handler for the sticky submit button
  const handleSubmitCase = async () => {
    try {
      // Pass both complainantSection and complainants to Firestore
      await submitNewCase(complainantSection, complainants);
      alert("Case submitted successfully!");
      setComplainantSection(initialComplainantSection); // Clear all Complainant section fields
      setComplainants([
        {
          lastname: "",
          firstname: "",
          middlename: "",
          extension: "",
          nickname: "",
          sex: "",
          birthdate: "",
          province: "",
          city: "",
          barangay: "",
          specific: "",
          contact: "",
          email: ""
        }
      ]); // Clear all complainant info fields
    } catch (err) {
      alert("Error submitting case: " + err.message);
    }
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
      
      {/* Case Status - Section */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Case Status</h1>
        {/* Case Status - Status */}
        <table className="case-status-table">
          <tbody>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600,  width: 220}}>
                Date:&nbsp;
                <input
                  type="date"
                  value={statusDate}
                  onChange={e => setStatusDate(e.target.value)}
                  className="case-status-input"
                  style={{ width: "70%" }}
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

        {/* Case Status - Repudiated Table */}
        <table className="case-status-table">
          <tbody>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600, background: "#f8f8f8" }}>
                {selectedStatus && <span>{selectedStatus}</span>}
              </td>
              <td className="case-status-cell" style={{fontWeight: 600, borderBottomColor: '#ffffff'}}>
                Main Point of Agreement/Award:
              </td>
            </tr>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600,  width: 220}}>
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

        {/* Case Status - Execution Table */}
        <table className="case-status-table">
          <tbody>
            <tr>
              <td className="case-status-cell" style={{fontWeight: 600,  width: 220}}>Execution</td>
              <td className="case-status-cell" style={{fontWeight: 600,  width: 240, textAlign: "center" }}>
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
              <td className="case-status-cell" style={{ width: 205 }}>
                Date:&nbsp;
                <input
                  type="date"
                  value={executionDate}
                  onChange={e => setExecutionDate(e.target.value)}
                  className="case-status-input"
                  style={{ width: "70%" }}
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
                  style={{ width: "85%" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Compliance to Amicable Settlement */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Compliance to Amicable Settlement</h1>
        <div className="newrecord-table-row">
          <table className="newrecord-table">
            <tbody>
              <tr>
              </tr>
              {ammicableRows.map((row, idx) => (
                <tr key={idx} style={{ position: idx === ammicableRows.length - 1 ? "relative" : "static" }}>
                  <td style={{ width: 0 }}>
                    <span style={{marginRight: 12}}>Date:</span>
                    <input
                      type="date"
                      value={row.date}
                      onChange={e => handleAmmicableChange(idx, "date", e.target.value)}
                      className="newrecord-input"
                      style={{ width: "70%" }}
                    />
                  </td>
                  <td style={{ paddingLeft: "0px" }}>
                    <span style={{marginLeft: 12, marginRight: 12 }}>Remarks:</span>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={e => handleAmmicableChange(idx, "remarks", e.target.value)}
                      className="newrecord-input"
                      placeholder="Enter remarks"
                      style={{ width: "90%" }}
                    />
                    {idx === ammicableRows.length - 1 && (
                      <button
                        className="newrecord-add-btn"
                        onClick={handleAddAmmicable}
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

      {/* Uploads */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Uploads</h1>
        <ul className="uploads-list">
          <li>
            <img src={uploadIcon} alt="Upload File" className="upload-icon" style={{ cursor: "pointer" }} tabIndex={0} />
            <span className="upload-label">Complaint Sheet</span>
          </li>
          <li>
            <img src={uploadIcon} alt="Upload File" className="upload-icon" style={{ cursor: "pointer" }} tabIndex={0} />
            <span className="upload-label">Amicable Settlement</span>
          </li>
          <li>
            <img src={uploadIcon} alt="Upload File" className="upload-icon" style={{ cursor: "pointer" }} tabIndex={0} />
            <span className="upload-label">Certificate to File Action</span>
          </li>
          <li>
            <img src={uploadIcon} alt="Upload File" className="upload-icon" style={{ cursor: "pointer" }} tabIndex={0} />
            <span className="upload-label">Photo</span>
          </li>
        </ul>
      </div>

      {/* Complainant Section */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Complainant</h1>
        <div className="complainant-wrapper">
          {/* Left Table */}
          <table className="complainant-table left">
            <tbody>
              <tr>
                <td className="complainant-label">Date &amp; Time Filed</td>
                <td>
                  <input
                    type="date"
                    className="newrecord-input small-input"
                    value={complainantSection.dateTimeFiled.split("T")[0] || ""}
                    onChange={e =>
                      handleComplainantSectionChange(
                        "dateTimeFiled",
                        e.target.value +
                          (complainantSection.dateTimeFiled.split("T")[1]
                            ? "T" + complainantSection.dateTimeFiled.split("T")[1]
                            : "")
                      )
                    }
                  />
                  <input
                    type="time"
                    className="newrecord-input small-input"
                    value={
                      complainantSection.dateTimeFiled.split("T")[1] || ""
                    }
                    onChange={e =>
                      handleComplainantSectionChange(
                        "dateTimeFiled",
                        (complainantSection.dateTimeFiled.split("T")[0] || "") +
                          "T" +
                          e.target.value
                      )
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="complainant-label">Date of Incident</td>
                <td>
                  <input
                    type="date"
                    className="newrecord-input small-input"
                    value={complainantSection.dateOfIncident}
                    onChange={e =>
                      handleComplainantSectionChange("dateOfIncident", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="complainant-label">Place of Incident</td>
                <td>
                  <input
                    type="text"
                    className="newrecord-input"
                    placeholder="Enter place"
                    value={complainantSection.placeOfIncident}
                    onChange={e =>
                      handleComplainantSectionChange("placeOfIncident", e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Right Table */}
          <table className="complainant-table right">
            <tbody>
              <tr>
                <td className="complainant-label" style={{ width: "20%" }}>
                  Nature of Complaint
                </td>
                <td>
                  <input
                    type="text"
                    className="newrecord-input"
                    placeholder="Enter nature"
                    value={complainantSection.natureOfComplaint}
                    onChange={e =>
                      handleComplainantSectionChange("natureOfComplaint", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="complainant-label">Offense/Violation</td>
                <td>
                  <input
                    type="text"
                    className="newrecord-input"
                    placeholder="Enter offense"
                    value={complainantSection.offenseViolation}
                    onChange={e =>
                      handleComplainantSectionChange("offenseViolation", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="complainant-label">Specific</td>
                <td>
                  <input
                    type="text"
                    className="newrecord-input"
                    placeholder="Enter specific"
                    value={complainantSection.specific}
                    onChange={e =>
                      handleComplainantSectionChange("specific", e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Complainant's Information Section */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Complainant’s Information</h1>
        {complainants.map((c, idx) => (
          <div
            key={idx}
            className="complainantInformation-row"
          >
            {/* Left Table */}
            <table className="complainantInformation-table left">
              <tbody>
                <tr>
                  <td className="complainantInformation-label">Lastname:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.lastname}
                      onChange={e => handleComplainantChange(idx, "lastname", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Firstname:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.firstname}
                      onChange={e => handleComplainantChange(idx, "firstname", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Middlename:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.middlename}
                      onChange={e => handleComplainantChange(idx, "middlename", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Extension:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.extension}
                      onChange={e => handleComplainantChange(idx, "extension", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Nickname:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.nickname}
                      onChange={e => handleComplainantChange(idx, "nickname", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Sex:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.sex}
                      onChange={e => handleComplainantChange(idx, "sex", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Birthdate:</td>
                  <td>
                    <input
                      type="date"
                      className="newrecord-input"
                      value={c.birthdate}
                      onChange={e => handleComplainantChange(idx, "birthdate", e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Right Table */}
            <table className="complainantInformation-table right">
              <thead>
                <tr>
                  <th colSpan={2}>Address and Contact Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="complainantInformation-label">Province:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.province}
                      onChange={e => handleComplainantChange(idx, "province", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">City/Mun:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.city}
                      onChange={e => handleComplainantChange(idx, "city", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Barangay:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.barangay}
                      onChange={e => handleComplainantChange(idx, "barangay", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">Specific:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.specific}
                      onChange={e => handleComplainantChange(idx, "specific", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="complainantInformation-label">ContactNo:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.contact}
                      onChange={e => handleComplainantChange(idx, "contact", e.target.value)}
                    />
                  </td>
                </tr>
                <tr style={{ position: idx === complainants.length - 1 ? "relative" : "static" }}>
                  <td className="complainantInformation-label">EmailAdd:</td>
                  <td style={{ position: "relative" }}>
                    <input
                      type="email"
                      className="newrecord-input"
                      value={c.email}
                      onChange={e => handleComplainantChange(idx, "email", e.target.value)}
                    />
                    {idx === complainants.length - 1 && (
                      <button
                        className="newrecord-add-btn add-btn-absolute"
                        type="button"
                        onClick={handleAddComplainant}
                      >
                        + ADD
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Respondent's Information Section */}
      <div className="newrecord-main-content">
        <h1 style={{ color: 'red' }}>Respondent’s Information</h1>
        {respondents.map((c, idx) => (
          <div
            key={idx}
            className="respondentInformation-row"
          >
            {/* Left Table */}
            <table className="respondentInformation-table left">
              <tbody>
                <tr>
                  <td className="respondentInformation-label">Lastname:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.lastname}
                      onChange={e => handleRespondentChange(idx, "lastname", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Firstname:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.firstname}
                      onChange={e => handleRespondentChange(idx, "firstname", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Middlename:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.middlename}
                      onChange={e => handleRespondentChange(idx, "middlename", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Extension:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.extension}
                      onChange={e => handleRespondentChange(idx, "extension", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Nickname:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.nickname}
                      onChange={e => handleRespondentChange(idx, "nickname", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Sex:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.sex}
                      onChange={e => handleRespondentChange(idx, "sex", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Birthdate:</td>
                  <td>
                    <input
                      type="date"
                      className="newrecord-input"
                      value={c.birthdate}
                      onChange={e => handleRespondentChange(idx, "birthdate", e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Right Table */}
            <table className="respondentInformation-table right">
              <thead>
                <tr>
                  <th colSpan={2}>Address and Contact Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="respondentInformation-label">Province:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.province}
                      onChange={e => handleRespondentChange(idx, "province", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">City/Mun:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.city}
                      onChange={e => handleRespondentChange(idx, "city", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Barangay:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.barangay}
                      onChange={e => handleRespondentChange(idx, "barangay", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">Specific:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.specific}
                      onChange={e => handleRespondentChange(idx, "specific", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="respondentInformation-label">ContactNo:</td>
                  <td>
                    <input
                      type="text"
                      className="newrecord-input"
                      value={c.contact}
                      onChange={e => handleRespondentChange(idx, "contact", e.target.value)}
                    />
                  </td>
                </tr>
                <tr style={{ position: idx === respondents.length - 1 ? "relative" : "static" }}>
                  <td className="respondentInformation-label">EmailAdd:</td>
                  <td style={{ position: "relative" }}>
                    <input
                      type="email"
                      className="newrecord-input"
                      value={c.email}
                      onChange={e => handleRespondentChange(idx, "email", e.target.value)}
                    />
                    {idx === respondents.length - 1 && (
                      <button
                        className="newrecord-add-btn add-btn-absolute"
                        type="button"
                        onClick={handleAddRespondent}
                      >
                        + ADD
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="sticky-button-panel">
        <button className="sticky-btn">
          <img src={printIcon} alt="Print" />
          <span>PRINT</span>
        </button>
        <button className="sticky-btn">
          <img src={editIcon} alt="Edit" />
          <span>EDIT</span>
        </button>
        <button className="sticky-btn submit" onClick={handleSubmitCase}>
          <img src={submitIcon} alt="Submit" />
          <span>SUBMIT</span>
        </button>
      </div>
    </div>
  );
}

export default NewRecordPage;