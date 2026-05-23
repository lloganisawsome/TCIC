import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics, isSupported as analyticsSupported } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
import {
  getDatabase,
  onValue,
  ref,
  set,
  update,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCs7P8qBISdmmtIkLJzhPJkHjSSZhoyj_U",
  authDomain: "generaluse-f4fea.firebaseapp.com",
  databaseURL: "https://generaluse-f4fea-default-rtdb.firebaseio.com",
  projectId: "generaluse-f4fea",
  storageBucket: "generaluse-f4fea.firebasestorage.app",
  messagingSenderId: "515153345419",
  appId: "1:515153345419:web:fa6da4eae5527bf64d4d8e",
  measurementId: "G-D831ZJ0ZT8"
};

export const app = initializeApp(firebaseConfig);
analyticsSupported().then((supported) => {
  if (supported) getAnalytics(app);
}).catch(() => {});

export const db = getDatabase(app);
export const SHOW_ROOT = "the-cost-is-correct/live-show";
export const firebaseTools = { onValue, ref, set, update, serverTimestamp };
