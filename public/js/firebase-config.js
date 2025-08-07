// Este arquivo centraliza a configuração do Firebase para ser usada em todo o site.
// Substitua pelas suas credenciais reais, que você já tem.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js';

export const firebaseConfig = {
    apiKey: "AIzaSyBUuKIfxUXGHIPH2eQBwUggWawexQ3-L5A",
    authDomain: "belem-hb.firebaseapp.com",
    projectId: "belem-hb",
    storageBucket: "belem-hb.appspot.com",
    messagingSenderId: "669142237239",
    appId: "1:669142237239:web:9fa0de02efe4da6865ffb2",
    measurementId: "G-92E26Y6HB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Analytics
export const db = getFirestore(app);
export const analytics = getAnalytics(app);