import { db } from "./firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

/**
 * Submits a new case to Firestore "cases" collection with a numeric document name,
 * and adds all complainants, respondents, case status, compliance, and case management entries as subcollections.
 * @param {Object} complainantInputs - The inputs from the Complainant section.
 * @param {Array<Object>} complainants - Array of complainant info objects.
 * @param {Array<Object>} respondents - Array of respondent info objects.
 * @param {Array<Object>|Object} caseStatus - Array of case status objects, or a single object.
 * @param {Array<Object>} compliance - Array of compliance objects.
 * @param {Object} caseManagement - Object containing arbitrationRows, conciliationRows, mediationRows.
 * @returns {Promise<string>} - The new case document ID (number as string).
 */
export async function submitNewCase(
  complainantInputs,
  complainants,
  respondents,
  caseStatus,
  compliance,
  caseManagement
) {
  const casesRef = collection(db, "cases");
  const snapshot = await getDocs(casesRef);

  // Find the highest numeric case name
  let maxCaseNum = 0;
  snapshot.forEach(docSnap => {
    const match = docSnap.id.match(/^caseId(\d+)$/);
    const caseNum = match ? parseInt(match[1], 10) : 0;
    if (caseNum > maxCaseNum) {
      maxCaseNum = caseNum;
    }
  });
  const nextCaseNum = maxCaseNum + 1;
  const caseDocId = `caseId${nextCaseNum}`;

  // Prepare the case data (main document)
  const caseData = {
    dateTimeFiled: complainantInputs.dateTimeFiled || "",
    dateOfIncident: complainantInputs.dateOfIncident || "",
    natureOfComplaint: complainantInputs.natureOfComplaint || "",
    offenseViolation: complainantInputs.offenseViolation || "",
    placeOfIncident: complainantInputs.placeOfIncident || "",
    specific: complainantInputs.specific || "",
    createdAt: new Date().toISOString()
  };

  // Add the new case with the next caseId<num> as the document name
  await setDoc(doc(casesRef, caseDocId), caseData);

  // Add complainants under cases/<caseDocId>/complainant/complainantIdN
  const complainantColRef = collection(db, "cases", caseDocId, "complainant");
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

  // Add respondents under cases/<caseDocId>/respondent/respondentIdN
  const respondentColRef = collection(db, "cases", caseDocId, "respondent");
  for (let i = 0; i < respondents.length; i++) {
    const r = respondents[i];
    const respondentDoc = {
      addressSpecific: r.specific || "",
      barangay: r.barangay || "",
      birthDate: r.birthdate || "",
      cityMunicipality: r.city || "",
      contactNo: r.contact || "",
      email: r.email || "",
      extension: r.extension || "",
      firstName: r.firstname || "",
      lastName: r.lastname || "",
      middleName: r.middlename || "",
      province: r.province || "",
      sex: r.sex || ""
    };
    await setDoc(doc(respondentColRef, `respondentId${i + 1}`), respondentDoc);
  }

  // Add case status under cases/<caseDocId>/caseStatus/caseStatusIdN
  const caseStatusColRef = collection(db, "cases", caseDocId, "caseStatus");
  const statusArray = Array.isArray(caseStatus) ? caseStatus : [caseStatus];
  for (let i = 0; i < statusArray.length; i++) {
    const s = statusArray[i];
    const caseStatusDoc = {
      statusDate: s?.statusDate || "",
      status: s?.selectedStatus || "",
      repudiated: s?.repudiated || "",
      mainPoint: s?.mainPoint || "",
      execution: s?.execution || "",
      executionDate: s?.executionDate || "",
      executionReason: s?.executionReason || ""
    };
    await setDoc(doc(caseStatusColRef, `caseStatusId${i + 1}`), caseStatusDoc);
  }

  // Add compliance under cases/<caseDocId>/compliance/complianceIdN
  const complianceColRef = collection(db, "cases", caseDocId, "compliance");
  for (let i = 0; i < (compliance?.length || 0); i++) {
    const comp = compliance[i];
    const complianceDoc = {
      date: comp?.date || "",
      remarks: comp?.remarks || ""
    };
    await setDoc(doc(complianceColRef, `complianceId${i + 1}`), complianceDoc);
  }

  // Add caseManagement under cases/<caseDocId>/caseManagement
  const caseManagementColRef = collection(db, "cases", caseDocId, "caseManagement");

  // Arbitration
  if (caseManagement?.arbitrationRows) {
    const arbitrationDocRef = doc(caseManagementColRef, "arbitration");
    const arbitrationFields = {};
    for (let i = 0; i < caseManagement.arbitrationRows.length; i++) {
      arbitrationFields[`arbitrationId${i + 1}`] = caseManagement.arbitrationRows[i];
    }
    await setDoc(arbitrationDocRef, arbitrationFields);
  }

  // Conciliation
  if (caseManagement?.conciliationRows) {
    const conciliationDocRef = doc(caseManagementColRef, "conciliation");
    const conciliationFields = {};
    for (let i = 0; i < caseManagement.conciliationRows.length; i++) {
      conciliationFields[`conciliationId${i + 1}`] = caseManagement.conciliationRows[i];
    }
    await setDoc(conciliationDocRef, conciliationFields);
  }

  // Mediation
  if (caseManagement?.mediationRows) {
    const mediationDocRef = doc(caseManagementColRef, "mediation");
    const mediationFields = {};
    for (let i = 0; i < caseManagement.mediationRows.length; i++) {
      mediationFields[`mediationId${i + 1}`] = caseManagement.mediationRows[i];
    }
    await setDoc(mediationDocRef, mediationFields);
  }

  return caseDocId;
}