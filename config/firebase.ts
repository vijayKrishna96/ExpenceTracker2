// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {initializeAuth , getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtpQjTxCR0ikVONRcTfSgKPg4QHaSnJ2I",
  authDomain: "expencetracker-761c2.firebaseapp.com",
  projectId: "expencetracker-761c2",
  storageBucket: "expencetracker-761c2.firebasestorage.app",
  messagingSenderId: "86074569334",
  appId: "1:86074569334:web:f76b2681191e936d742557",
  measurementId: "G-JG9HFYDGS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


//db
export const firestore = getFirestore(app)