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

// const firebaseConfig = {
//   apiKey: "AIzaSyD2unKInlssiP4y0CuDUtfalrA9JNl5ED4",
//   authDomain: "student-discount-786.firebaseapp.com",
//   projectId: "student-discount-786",
//   storageBucket: "student-discount-786.firebasestorage.app",
//   messagingSenderId: "990520237892",
//   appId: "1:990520237892:web:eea60cad2c02d19e1bc111",
//   measurementId: "G-M7GX67EQXV",
// };

const firebaseConfig = {
  apiKey: "AIzaSyC4lqrQ8zwJesCZrElkYrltpZRQvr7Ybk4",
  authDomain: "student-discount-26563.firebaseapp.com",
  projectId: "student-discount-26563",
  storageBucket: "student-discount-26563.firebasestorage.app",
  messagingSenderId: "572119937543",
  appId: "1:572119937543:web:4a69c93547afa02bb0f0a2",
  measurementId: "G-TBE4NKP6WV"
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
