import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBmi0NCAgpJtcmy6mywHzSDTslY3gfm8v4",
    authDomain: "sorteo-9d8f8.firebaseapp.com",
    projectId: "sorteo-9d8f8",
    storageBucket: "sorteo-9d8f8.firebasestorage.app",
    messagingSenderId: "318280113935",
    appId: "1:318280113935:web:945711ee4fe687e910687a",
    measurementId: "G-M12GSFD5VD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
