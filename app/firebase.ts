import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  setPersistence,
  browserLocalPersistence,
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3DytZEugC6y4gHu4CJMUZewG69SX6YQo",
  authDomain: "studentdiscount-e33ca.firebaseapp.com",
  databaseURL: "https://studentdiscount-e33ca-default-rtdb.firebaseio.com",
  projectId: "studentdiscount-e33ca",
  storageBucket: "studentdiscount-e33ca.firebasestorage.app",
  messagingSenderId: "234665736317",
  appId: "1:234665736317:web:85d9a6fb45381a49311914",
  measurementId: "G-Q8ZKSDZEVL"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export {
  auth,
  db,
  getFirestore,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
};
