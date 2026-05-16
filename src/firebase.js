import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Crucial for database operations!

const firebaseConfig = {
  apiKey: "AIzaSyCYohXxC1Nhh3e9cQu8kDYLm1HN69vOdDU",
  authDomain: "samaroh-4e225.firebaseapp.com",
  projectId: "samaroh-4e225",
  storageBucket: "samaroh-4e225.firebasestorage.app",
  messagingSenderId: "221927176992",
  appId: "1:221927176992:web:447501eca2e20ba880b545",
  measurementId: "G-HK4CPXJNC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore Database
export const db = getFirestore(app);