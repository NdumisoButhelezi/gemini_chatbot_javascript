// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7hLo7WRCJ4UHTeGib-51fdulxMwAw-iQ",
  authDomain: "ai-mentor-app-1441c.firebaseapp.com",
  projectId: "ai-mentor-app-1441c",
  storageBucket: "ai-mentor-app-1441c.firebasestorage.app",
  messagingSenderId: "336345816193",
  appId: "1:336345816193:web:dacc65d9995dfa0735c180",
  measurementId: "G-6SFV263PSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);