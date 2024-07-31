import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
/* Cesar one
const firebaseConfig = {
  apiKey: "AIzaSyDd0OZuIdodjTN2ORtHu2z6nYwgImNYlic",
  authDomain: "fir-auth-957d9.firebaseapp.com",
  projectId: "fir-auth-957d9",
  storageBucket: "fir-auth-957d9.appspot.com",
  messagingSenderId: "114759002890",
  appId: "1:114759002890:web:0477136cfecf4a93a328f3"
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyALDEA-_yEthfw-vSUnGdUv8rzPFLJVdcU",
  authDomain: "swift-start-13833.firebaseapp.com",
  projectId: "swift-start-13833",
  storageBucket: "swift-start-13833.appspot.com",
  messagingSenderId: "572444694882",
  appId: "1:572444694882:web:68d2f9d107e4e7a375343b"
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

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
