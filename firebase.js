import { getFirestore } from 'firebase/firestore'; 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC_oxie04HSu2Lnk7cKktl5iqLtz_4N90",
  authDomain: "flashcard-saas-faba6.firebaseapp.com",
  projectId: "flashcard-saas-faba6",
  storageBucket: "flashcard-saas-faba6.appspot.com",
  messagingSenderId: "112348219260",
  appId: "1:112348219260:web:5da27882f5f192822d46f9",
  measurementId: "G-QPSSP1H8WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const firestore = getFirestore(app);
export default app;

// Export Firestore and Auth
export { firestore };