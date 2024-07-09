// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd0OZuIdodjTN2ORtHu2z6nYwgImNYlic",
  authDomain: "fir-auth-957d9.firebaseapp.com",
  projectId: "fir-auth-957d9",
  storageBucket: "fir-auth-957d9.appspot.com",
  messagingSenderId: "114759002890",
  appId: "1:114759002890:web:0477136cfecf4a93a328f3"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
