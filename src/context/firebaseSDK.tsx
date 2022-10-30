import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDy8mVX39MWAn628w2yd1bSv7vtnYBbXQQ",
  authDomain: "d-sig-2f338.firebaseapp.com",
  projectId: "d-sig-2f338",
  storageBucket: "d-sig-2f338.appspot.com",
  messagingSenderId: "95611418613",
  appId: "1:95611418613:web:c852fad3d086567152d2bc",
  measurementId: "G-WLG38432KP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
