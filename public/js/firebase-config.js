// Central de configuração do Firebase (versão 11.8.1)
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js';

export const firebaseConfig = {
    apiKey: "AIzaSyBUuKIfxUXGHIPH2eQBwUggWawexQ3-L5A",
    authDomain: "belem-hb.firebaseapp.com",
    projectId: "belem-hb",
    storageBucket: "belem-hb.appspot.com",
    messagingSenderId: "669142237239",
    appId: "1:669142237239:web:9fa0de02efe4da6865ffb2",
    measurementId: "G-92E26Y6HB1"
};

// Initialize Firebase (evita múltiplas inicializações)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export { app };