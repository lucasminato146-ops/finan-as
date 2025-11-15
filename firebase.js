// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdN0kT33guyyNyynUSrSZprs9IW0ZTxMY",
  authDomain: "sistema-financeiro-3b837.firebaseapp.com",
  projectId: "sistema-financeiro-3b837",
  storageBucket: "sistema-financeiro-3b837.firebasestorage.app",
  messagingSenderId: "875434775290",
  appId: "1:875434775290:web:b82c6d3f86c4c3c549ef43",
  measurementId: "G-HX0ZHNMLBZ"
};

// Inicializa o Firebase
export const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
