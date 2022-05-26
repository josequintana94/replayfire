// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7OKKA1sbqsr9-1-N9Or7tLVQm-pHJTVg",
  authDomain: "replay-1b81c.firebaseapp.com",
  projectId: "replay-1b81c",
  storageBucket: "replay-1b81c.appspot.com",
  messagingSenderId: "736345985609",
  appId: "1:736345985609:web:11d7c9cef1e289f79ae598"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig); //initialize firebase app 
module.exports = { firebase }; //export the app