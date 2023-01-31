import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9QqhhzVsNKaXR3ci3j85MfNb9w2-ErIE",
  authDomain: "rating-web-dieu-le.firebaseapp.com",
  projectId: "rating-web-dieu-le",
  storageBucket: "rating-web-dieu-le.appspot.com",
  messagingSenderId: "863914112947",
  appId: "1:863914112947:web:ffd7569961660d863bfdc6",
  measurementId: "G-HFV6QP2GGT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
