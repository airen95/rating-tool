
import { signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { auth } from './firebase-init.js';

function initUserInfo() {
  if (localStorage.getItem('email')) {
    $('#email').html(localStorage.getItem('email'));
    return localStorage.getItem('email');
  }
}

function initSignOut() {
  $("#sign-out").click(function(e) {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
    signOut(auth);
    window.location.href = '/sign-in.html';
  });
}

export {
  initUserInfo,
  initSignOut,
};
