import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function FirestoreTest() {
  const [cases, setCases] = useState([]);

  // Fetch all cases
  async function fetchCases() {
    const querySnapshot = await getDocs(collection(db, "cases"));
    const casesArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCases(casesArray);
  }

  // Add a test case when button is clicked
  async function testFirestore() {
    await addDoc(collection(db, "cases"), {
      name: "Test Case",
      status: "Open",
      createdAt: new Date()
    });
    fetchCases();
  }

  // Load cases on first render
  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Firestore Test</h1>
      <button onClick={testFirestore}>Add Test Case</button>
      {cases.length === 0 ? (
        <p>Loading cases...</p>
      ) : (
        <ul>
          {cases.map(c => (
            <li key={c.id}>
              {c.name} – {c.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FirestoreTest;
