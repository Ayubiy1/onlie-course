import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB5wZg-FZ29O8JNOGSYq3EC3XsO5nZX9Sc",
    authDomain: "lms-app-7eb84.firebaseapp.com",
    projectId: "lms-app-7eb84",
    storageBucket: "lms-app-7eb84.firebasestorage.app",
    messagingSenderId: "619992374645",
    appId: "1:619992374645:web:bbecd3b1f8eeeb67a2073c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// // Firebase'ni ishga tushiramiz
// const app = initializeApp(firebaseConfig);

// // Auth xizmati
// export const auth = getAuth(app);
