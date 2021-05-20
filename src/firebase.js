// Configuration for firebase authenntication

import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider_id = firebase.auth.EmailAuthProvider.PROVIDER_ID;
const signInOptions = [
  {
    provider: provider_id,
    disableSignUp: {
      status: true,
      adminEmail: 'admin@cybersecurityfordemocracy.org',
    },
  }
];

export { auth, signInOptions };
