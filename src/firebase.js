import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAVZ67gHgduj7eKatedhluQ7e9eTsOVGpk",
  authDomain: "instagram-clone-ca3a8.firebaseapp.com",
  projectId: "instagram-clone-ca3a8",
  storageBucket: "instagram-clone-ca3a8.appspot.com",
  messagingSenderId: "1049198222720",
  appId: "1:1049198222720:web:f136450c741c21aefdb565",
  measurementId: "G-50ETCLKCNE"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };