import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie';

import { auth, provider_id } from "./firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import 'firebaseui/dist/firebaseui.css';

const signInSuccessUrl = '/authorize';
const id_token_cookie_name = 'id_token';

const firebaseUiConfig = {
  signInSuccessUrl,
  signInOptions: [
    provider_id
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

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in, so display the "sign out" button and login info.
    console.log(`Signed in as ${user.displayName} (${user.email})`);
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
  }
}, function (error) {
  console.log(error);
  alert('Unable to log in: ' + error)
});

function LoginForm() {
  return (
    <>
    <StyledFirebaseAuth uiConfig={firebaseUiConfig} firebaseAuth={auth} />
    </>
  );
};

export default LoginForm;