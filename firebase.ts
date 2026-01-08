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
 * 🔥 FIREBASE CONFIGURATION
 * Loads from environment variables for security.
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

// Validate Firebase config to prevent silent app crashes
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.error('❌ Firebase API key is missing. Check your environment variables.');
  throw new Error('Firebase API key is required.');
}

if (!firebaseConfig.projectId || firebaseConfig.projectId === 'undefined') {
  console.error('❌ Firebase Project ID is missing.');
  throw new Error('Firebase Project ID is required.');
}

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * 🔐 Auth State Listener
 * Standardized callback for React components.
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return fbOnAuthStateChanged(auth, callback);
};

/**
 * 🔑 Login user
 */
export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

/**
 * 🆕 Register user + create initial Firestore profile
 */
export const signUpUser = async (email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  try {
    // Initialize profile document in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn(
      "Initial Firestore write failed (check Security Rules). User is logged in, but profile was not created.",
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

// Export Firestore helpers for use in components
export { doc, getDoc, setDoc, updateDoc };
