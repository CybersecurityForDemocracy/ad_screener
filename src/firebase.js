import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByBm2L9U18Mg7ypAM_U_7nijNXo1XrjP0",
  authDomain: "ad-screener.firebaseapp.com",
  projectId: "ad-screener",
  storageBucket: "ad-screener.appspot.com",
  messagingSenderId: "598538092408",
  appId: "1:598538092408:web:6f3260bbb8535625fa128d"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider_id = firebase.auth.EmailAuthProvider.PROVIDER_ID;

export { auth, provider_id };