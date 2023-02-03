import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { app, auth } from './firebase-init.js';

const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.setCustomParameters({
    'hd': 'sssmarket.com'
});

if (window.sessionStorage.getItem('pending')) {
  window.sessionStorage.removeItem('pending');
  $('#loading').show();
  $('#login-content').hide();
}

$(document).ready(function() {
  $('.login-with-google-btn').click(() => {
    $('#loading').show();
    $('#login-content').hide();
    window.sessionStorage.setItem('pending', 1);
    signInWithRedirect(auth, provider).then(() => {
    }).catch((error) => {
      $('#loading').hide();
      $('#login-content').show();
    });
  });

  getRedirectResult(auth)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    localStorage.setItem('token', user.accessToken);
    localStorage.setItem('email', user.email);
    localStorage.setItem('uid', user.uid);
    window.location.href = '/index.html';
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    $('#loading').hide();
    $('#login-content').show();
  });
});
