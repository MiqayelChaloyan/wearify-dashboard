import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCCnNKsa48fEZzg5E2W9A6dAKt_aTnBBfE",
    authDomain: "w2wprod-f2fd0.firebaseapp.com",
    databaseURL: "https://w2wprod-f2fd0-default-rtdb.firebaseio.com",
    projectId: "w2wprod-f2fd0",
    storageBucket: "w2wprod-f2fd0.appspot.com",
    messagingSenderId: "541303304478",
    appId: "1:541303304478:web:90e81c2e23b394bbdf590f",
    measurementId: "G-CBNF7CR94E"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
