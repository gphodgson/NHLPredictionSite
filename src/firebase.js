import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    projectId: process.env.VUE_APP_FIREBASE_ID,
    apiKey: process.env.VUE_APP_FIREBASE_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {app, auth};