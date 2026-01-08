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
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn(
      "Firestore write failed (check rules). User is still logged in.",
      error
    );
  }

  return user;
};

/**
 * 🚪 Logout user
 */
export const signOut = async () => {
  return fbSignOut(auth);
};

// Firestore helpers (re-export)
export { doc, getDoc, setDoc, updateDoc };
