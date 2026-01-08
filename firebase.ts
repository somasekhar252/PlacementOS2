<<<<<<< HEAD
// firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as fbOnAuthStateChanged,
  signOut as fbSignOut,
  User
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";

/**
 * 🔥 FIREBASE CONFIGURATION (from environment variables)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase config
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined' || !firebaseConfig.apiKey.trim()) {
  console.error('❌ Firebase API key is missing or invalid!');
  console.error('Current value:', import.meta.env.VITE_FIREBASE_API_KEY);
  console.error('Please check your environment variables in Vercel.');
  throw new Error('Firebase API key is required. Please set VITE_FIREBASE_API_KEY in your environment variables.');
}

if (!firebaseConfig.projectId || firebaseConfig.projectId === 'undefined') {
  console.error('❌ Firebase Project ID is missing!');
  throw new Error('Firebase Project ID is required. Please set VITE_FIREBASE_PROJECT_ID in your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * 🔐 Auth State Listener
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return fbOnAuthStateChanged(auth, callback);
};

/**
 * 🔑 Login user
 */
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

/**
 * 🆕 Register user + create Firestore profile
 */
export const signUpUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  try {
    const userRef = doc(db, "users", user.uid);
=======

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signOut as fbSignOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * FIREBASE CONFIGURATION
 */
const firebaseConfig = {
  apiKey: "AIzaSyDFO1z-upVOuJp-v0nMKJCHMq2XD3RvVN8",
  authDomain: "placementos-ai-d335c.firebaseapp.com",
  projectId: "placementos-ai-d335c",
  storageBucket: "placementos-ai-d335c.firebasestorage.app",
  messagingSenderId: "734192125170",
  appId: "1:734192125170:web:d79f7473fc76e1091ffc6b",
  measurementId: "G-XXTMG65Y1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const onAuthStateChanged = (callback: (user: any) => void) => {
  return fbOnAuthStateChanged(auth, callback);
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const signUpUser = async (email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  try {
    // Attempt to initialize profile document
    const userRef = doc(db, 'users', user.uid);
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      profileCompleted: false,
<<<<<<< HEAD
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn(
      "Firestore write failed (check rules). User is still logged in.",
      error
    );
=======
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn("Initial Firestore write failed (likely due to rules). The user is still logged in.");
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
  }

  return user;
};

<<<<<<< HEAD
/**
 * 🚪 Logout user
 */
=======
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
export const signOut = async () => {
  return fbSignOut(auth);
};

<<<<<<< HEAD
// Firestore helpers (re-export)
=======
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
export { doc, getDoc, setDoc, updateDoc };
