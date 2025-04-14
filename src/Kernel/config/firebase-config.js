// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyC31qtcgL32JRSBTeXxrMP3MfoGx4Yt4Rc",
    authDomain: "josle5e.firebaseapp.com",
    databaseURL: "https://josle5e-default-rtdb.firebaseio.com",
    projectId: "josle5e",
    storageBucket: "josle5e.firebasestorage.app",
    messagingSenderId: "143574372151",
    appId: "1:143574372151:web:3c26be32fe62bcc8b6d4b2"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, signInWithCustomToken, storage };
