import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_API_KEY,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_API_KEY,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_KEY_API_KEY,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_API_KEY,
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
