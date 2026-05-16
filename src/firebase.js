import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYohXxC1Nhh3e9cQu8kDYLm1HN69voDdU",
  authDomain: "samaroh-4e225.firebaseapp.com",
  projectId: "samaroh-4e225",
  storageBucket: "samaroh-4e225.appspot.com",
  messagingSenderId: "221927176992",
  appId: "1:221927176992:web:447501eca2e20ba880b545"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);