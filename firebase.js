
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCf16umN3OGmxO1ROvsYasaO2bml3s4yg",
  authDomain: "brand-conect-erum.firebaseapp.com",
  projectId: "brand-conect-erum",
  storageBucket: "brand-conect-erum.firebasestorage.app",
  messagingSenderId: "955095147285",
  appId: "1:955095147285:web:4c15940d006ba0bfb57f1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
