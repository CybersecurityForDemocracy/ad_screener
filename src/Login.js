import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie';

import firebase from 'firebase/app';
import "firebase/auth";
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

function LoginForm() {
  const signInSuccessUrl = '/authorize';
  const id_token_cookie_name = 'id_token';
  var firebaseConfig = {
    apiKey: "AIzaSyByBm2L9U18Mg7ypAM_U_7nijNXo1XrjP0",
    authDomain: "ad-screener.firebaseapp.com",
    projectId: "ad-screener",
    storageBucket: "ad-screener.appspot.com",
    messagingSenderId: "598538092408",
    appId: "1:598538092408:web:6f3260bbb8535625fa128d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const handleSignOut = function () {
    firebase.auth().signOut();
  };

  const firebaseUiConfig = {
          signInSuccessUrl,
          signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
          ],
          callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
              console.log(`authResult: ${JSON.stringify(authResult)}`)
              // User successfully signed in.
              // Return type determines whether we continue the redirect automatically
              // or whether we leave that to developer to handle.
              return true;
            },
            uiShown: function() {
              // The widget is rendered.
              // Hide the loader.
              document.getElementById('loader').style.display = 'none';
            },
            disableEmailSignUpStatus: true,
          },

          // Other config options...
        };

  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in, so display the "sign out" button and login info.
        console.log(`Signed in as ${user.displayName} (${user.email})`);
        document.getElementById('sign-out').hidden = false;
        user.getIdToken().then(function (token) {
          // Add the token to the browser's cookies. The server will then be
          // able to verify the token against the API.
          // SECURITY NOTE: As cookies can easily be modified, only put the
          // token (which is verified server-side) in a cookie; do not add other
          // user information.
          // document.cookie = "token=" + token;
          // Cookies.set(id_token_cookie_name, token, {'secure': true});
          Cookies.set(id_token_cookie_name, token);
          console.log(`id_token: ${token}`);
          console.log(`cookie id_token: ${Cookies.get(id_token_cookie_name)}`);
          // document.location = signInSuccessUrl;
        });
      } else {
        console.log(`signin failed or not started`);
        // User is signed out.
        // Remove any existing id_token for this site
        Cookies.remove(id_token_cookie_name);
        console.log(`cookie id_token: ${Cookies.get(id_token_cookie_name)}`);
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', firebaseUiConfig);
        // Show the Firebase login button.
        // ui.start('#firebaseui-auth-container', uiConfig);
        // // Update the login state indicators.
        document.getElementById('sign-out').hidden = true;
        // document.getElementById('login-info').hidden = true;
        // // Clear the token cookie.
        // document.cookie = "token=";
      }
    }, function (error) {
      console.log(error);
      alert('Unable to log in: ' + error)
    });

  return (
    <>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
    <button id="sign-out" hidden="true" onClick={handleSignOut}>Sign Out</button>
    </>
  );
};

export default LoginForm;
