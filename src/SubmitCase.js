import { db } from "./firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

/**
 * Submits a new case to Firestore "cases" collection with a numeric document name,
 * and adds all complainants under cases/<caseNum>/complainant/complainantIdN.
 * @param {Object} complainantInputs - The inputs from the Complainant section.
 * @param {Array<Object>} complainants - Array of complainant info objects.
 * @returns {Promise<string>} - The new case document ID (number as string).
 */
export async function submitNewCase(complainantInputs, complainants) {
  const casesRef = collection(db, "cases");
  const snapshot = await getDocs(casesRef);

  // Find the highest numeric case name
  let maxCaseNum = 0;
  snapshot.forEach(docSnap => {
    const caseNum = parseInt(docSnap.id, 10);
    if (!isNaN(caseNum) && caseNum > maxCaseNum) {
      maxCaseNum = caseNum;
    }
  });
  const nextCaseNum = (maxCaseNum + 1).toString();

  // Prepare the case data
  const caseData = {
    dateTimeFiled: complainantInputs.dateTimeFiled || "",
    dateOfIncident: complainantInputs.dateOfIncident || "",
    natureOfComplaint: complainantInputs.natureOfComplaint || "",
    offenseViolation: complainantInputs.offenseViolation || "",
    placeOfIncident: complainantInputs.placeOfIncident || "",
    specific: complainantInputs.specific || "",
    createdAt: new Date().toISOString()
  };

  // Add the new case with the next case number as the document name
  await setDoc(doc(casesRef, nextCaseNum), caseData);

  // Add complainants under cases/<nextCaseNum>/complainant/complainantIdN
  const complainantColRef = collection(db, "cases", nextCaseNum, "complainant");
  for (let i = 0; i < complainants.length; i++) {
    const c = complainants[i];
    const complainantDoc = {
      addressSpecific: c.specific || "",
      barangay: c.barangay || "",
      birthDate: c.birthdate || "",
      cityMunicipality: c.city || "",
      contactNo: c.contact || "",
      email: c.email || "",
      extension: c.extension || "",
      firstName: c.firstname || "",
      lastName: c.lastname || "",
      middleName: c.middlename || "",
      province: c.province || "",
      sex: c.sex || ""
    };
    await setDoc(doc(complainantColRef, `complainantId${i + 1}`), complainantDoc);
  }

  return nextCaseNum;
}