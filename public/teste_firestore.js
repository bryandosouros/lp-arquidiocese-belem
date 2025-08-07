// Teste de conectividade com o Firestore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, query, getDocs, limit } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBUuKIfxUXGHIPH2eQBwUggWawexQ3-L5A",
    authDomain: "belem-hb.firebaseapp.com",
    projectId: "belem-hb",
    storageBucket: "belem-hb.appspot.com",
    messagingSenderId: "669142237239",
    appId: "1:669142237239:web:9fa0de02efe4da6865ffb2",
    measurementId: "G-92E26Y6HB1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testarFirestore() {
    try {
        console.log('🔥 Testando conexão com Firestore...');
        
        // Buscar posts sem filtros para ver se há dados
        const q = query(collection(db, 'posts'), limit(3));
        const querySnapshot = await getDocs(q);
        
        console.log(`📊 Total de documentos encontrados: ${querySnapshot.size}`);
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('📄 Post:', {
                id: doc.id,
                title: data.title,
                status: data.status,
                publishedDate: data.publishedDate,
                createdDate: data.createdDate
            });
        });
        
        console.log('✅ Teste concluído com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Executar teste
testarFirestore();
