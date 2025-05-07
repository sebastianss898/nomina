
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSCNxyDQQ9ByhjUq5ty503rVb_FQhGqIw",
  authDomain: "nomina-16daf.firebaseapp.com",
  projectId: "nomina-16daf",
  storageBucket: "nomina-16daf.firebasestorage.app",
  messagingSenderId: "379968165180",
  appId: "1:379968165180:web:c863605a00a389b8f9ba39",
  measurementId: "G-373Q06FJE3"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);