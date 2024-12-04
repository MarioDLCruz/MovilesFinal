import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhtkVWEZroHNlvKn1EIViI4xVRJozQfIc",
  authDomain: "linkerbash.firebaseapp.com",
  projectId: "linkerbash",
  storageBucket: "linkerbash.firebasestorage.app",
  messagingSenderId: "729255961845",
  appId: "1:729255961845:web:964bc384ac535db43151bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
