// Login form
import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from "axios";

import { auth, signInOptions } from "./firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import 'firebaseui/dist/firebaseui.css';

const signInSuccessUrl = '/';

const firebaseUiConfig = {
  signInSuccessUrl,
  signInOptions,
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
  },
  // Other config options...
};

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in, so display the "sign out" button and login info.
    user.getIdToken().then(function (token) {
      axios
        .post('/authorize', {id_token: token})
        .then((response) => {
        })
        // TODO(macpd): handle these errors properly
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    });
  } else {
      axios
        .get('/logout')
        .then((response) => {
        })
        // TODO(macpd): handle these errors properly
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
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
