// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmSK7Yzax0IkIXJKxJ8ok0RaLxYfgE7e8",
  authDomain: "barangay-balibago-case-portal.firebaseapp.com",
  projectId: "barangay-balibago-case-portal",
  storageBucket: "barangay-balibago-case-portal.firebasestorage.app",
  messagingSenderId: "330857228279",
  appId: "1:330857228279:web:e4d8c29d1a66b4326b30f2",
  measurementId: "G-KT492NK79Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore and export it
export const db = getFirestore(app);
