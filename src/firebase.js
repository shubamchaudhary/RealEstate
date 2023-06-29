// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCrHNFTqMbKZFSrRsoStC-b0Z1E6lCmiM",
  authDomain: "realestate-3e7ce.firebaseapp.com",
  projectId: "realestate-3e7ce",
  storageBucket: "realestate-3e7ce.appspot.com",
  messagingSenderId: "364485449715",
  appId: "1:364485449715:web:61d06109bbfcc280c8e486"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()