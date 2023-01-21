/* eslint-disable no-unused-vars */
import { createApp } from 'vue'
import App from './App.vue'
import {VueToastr} from 'vue-toastr'
import "vue-toastr/dist/style.css";


// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDFszPXYxAMeNu1HOVcdYbaKf59v2uVYGw",

  authDomain: "nhlpredictions-bdbb5.firebaseapp.com",

  databaseURL: "https://nhlpredictions-bdbb5-default-rtdb.firebaseio.com",

  projectId: "nhlpredictions-bdbb5",

  storageBucket: "nhlpredictions-bdbb5.appspot.com",

  messagingSenderId: "1005407039817",

  appId: "1:1005407039817:web:ffb61a1daef4ff04de6a98",

  measurementId: "G-KSC6TDL5ZD"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

getAnalytics(app);

createApp(App)
.use(VueToastr, {
    defaultTimeout: 3000,
    defaultProgressBar: true,
    defaultPosition: "toast-top-center",
})
.mount('#app')
