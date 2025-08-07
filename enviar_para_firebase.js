const fs = require('fs');

// Para usar Firebase em Node.js, vamos usar uma abordagem diferente
// Vamos criar um script que usa a configuração web do Firebase

// Função para simular delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função principal para enviar posts para o Firebase
async function enviarPostsParaFirebase() {
    try {
        console.log('🚀 Iniciando envio dos posts para o Firebase...');
        
        // Verificar se o arquivo existe
        const arquivoJson = './posts_migrados.json';
        if (!fs.existsSync(arquivoJson)) {
            throw new Error(`Arquivo ${arquivoJson} não encontrado!`);
        }
        
        // Ler e fazer parse do arquivo JSON
        console.log('📖 Lendo arquivo posts_migrados.json...');
        const dadosJson = fs.readFileSync(arquivoJson, 'utf8');
        const posts = JSON.parse(dadosJson);
        
        console.log(`📊 Total de posts para enviar: ${posts.length}`);
        
        // Importar Firebase usando ES modules syntax em ambiente Node.js
        const { initializeApp } = await import('firebase/app');
        const { getFirestore, collection, addDoc, connectFirestoreEmulator } = await import('firebase/firestore');
        
        // Configuração do Firebase (mesma do arquivo firebase-config.js)
        const firebaseConfig = {
            apiKey: "AIzaSyBUuKIfxUXGHIPH2eQBwUggWawexQ3-L5A",
            authDomain: "belem-hb.firebaseapp.com",
            projectId: "belem-hb",
            storageBucket: "belem-hb.appspot.com",
            messagingSenderId: "669142237239",
            appId: "1:669142237239:web:9fa0de02efe4da6865ffb2",
            measurementId: "G-92E26Y6HB1"
        };
        
        console.log('🔥 Conectando ao Firebase...');
        
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Para desenvolvimento local, você pode descomentar a linha abaixo para usar o emulador
        // connectFirestoreEmulator(db, 'localhost', 8080);
        
        console.log('✅ Conexão com Firestore estabelecida!');
        console.log('📤 Iniciando envio dos posts...\n');
        
        // Contadores para estatísticas
        let sucessos = 0;
        let erros = 0;
        
        // Percorrer todos os posts e enviá-los um por um
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            
            try {
                // Preparar dados do post para o Firestore
                const dadosPost = {
                    title: post.title,
                    content: post.content,
                    publishedDate: new Date(post.publishedDate),
                    slug: post.slug,
                    author: post.author,
                    categories: post.categories || [],
                    originalId: post.originalId || null,
                    bloggerFilename: post.bloggerFilename || null,
                    status: post.status || 'PUBLISHED',
                    createdDate: new Date(post.createdDate || post.publishedDate),
                    updatedDate: new Date(post.updatedDate || post.publishedDate),
                    migratedAt: new Date()
                };
                
                // Enviar post para Firestore
                const docRef = await addDoc(collection(db, 'posts'), dadosPost);
                
                sucessos++;
                const tituloTruncado = post.title.length > 50 
                    ? post.title.substring(0, 50) + '...' 
                    : post.title;
                
                console.log(`✅ Post "${tituloTruncado}" enviado com sucesso! (${i + 1}/${posts.length}) - ID: ${docRef.id}`);
                
                // Delay para não sobrecarregar o Firebase
                await delay(150); // Aumentei um pouco o delay para ser mais seguro
                
            } catch (error) {
                erros++;
                console.error(`❌ Erro ao enviar post ${i + 1}: ${error.message}`);
                
                // Log do título do post que falhou para facilitar debug
                const tituloTruncado = post.title?.length > 50 
                    ? post.title.substring(0, 50) + '...' 
                    : post.title || 'Título não encontrado';
                console.error(`   Post que falhou: "${tituloTruncado}"`);
                
                // Se há muitos erros consecutivos, pode ser um problema de autenticação
                if (erros > 5 && sucessos === 0) {
                    throw new Error('Muitos erros consecutivos. Possível problema de autenticação ou conectividade.');
                }
            }
        }
        
        // Relatório final
        console.log('\n' + '='.repeat(60));
        console.log('🎉 ENVIO PARA FIREBASE CONCLUÍDO!');
        console.log('='.repeat(60));
        console.log(`📊 Estatísticas:`);
        console.log(`   ✅ Posts enviados com sucesso: ${sucessos}`);
        console.log(`   ❌ Posts com erro: ${erros}`);
        console.log(`   📦 Total processado: ${posts.length}`);
        console.log(`   📈 Taxa de sucesso: ${((sucessos / posts.length) * 100).toFixed(1)}%`);
        
        if (sucessos > 0) {
            console.log(`\n🚀 Migração para o Firebase concluída! ${sucessos} posts foram enviados com sucesso para a coleção 'posts'.`);
        }
        
        if (erros > 0) {
            console.log(`\n⚠️  Alguns posts apresentaram erros. Verifique os logs acima para mais detalhes.`);
        }
        
        console.log('\n📋 Para executar o script novamente:');
        console.log('   node enviar_para_firebase.js');
        
    } catch (error) {
        console.error('💥 Erro crítico durante o envio:', error.message);
        
        if (error.message.includes('permission') || error.message.includes('authentication')) {
            console.log('\n🔧 Possíveis soluções:');
            console.log('   1. Certifique-se de que as regras do Firestore permitem escrita');
            console.log('   2. Verifique se a configuração do Firebase está correta');
            console.log('   3. Para desenvolvimento, considere usar regras abertas temporariamente:');
            console.log('      rules_version = "2";');
            console.log('      service cloud.firestore {');
            console.log('        match /databases/{database}/documents {');
            console.log('          match /{document=**} {');
            console.log('            allow read, write: if true;');
            console.log('          }');
            console.log('        }');
            console.log('      }');
        }
        
        process.exit(1);
    }
}

// Executar o script
console.log('🔥 SCRIPT DE ENVIO PARA FIREBASE - VERSÃO WEB SDK');
console.log('================================================');
console.log('Este script enviará todos os posts do arquivo posts_migrados.json');
console.log('para a coleção "posts" no Firestore do projeto belem-hb.');
console.log('');

enviarPostsParaFirebase();
