const fs = require('fs');

console.log('🔧 PREPARAÇÃO PARA MIGRAÇÃO');
console.log('============================');
console.log('Este script prepara o ambiente para a migração modificando');
console.log('temporariamente as regras do Firestore para permitir escrita.');
console.log('');

// Fazer backup das regras atuais
if (fs.existsSync('firestore.rules')) {
    fs.copyFileSync('firestore.rules', 'firestore.rules.backup');
    console.log('✅ Backup criado: firestore.rules.backup');
}

// Criar regras temporárias (mais permissivas)
const regrasTemporrarias = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // REGRAS TEMPORÁRIAS PARA MIGRAÇÃO - PERMITEM ESCRITA SEM AUTENTICAÇÃO
    match /posts/{postId} {
      allow read, write: if true;
    }
    
    // Outras coleções mantêm suas regras
    match /roles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Desabilitado durante migração
    }
    
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /newsletter/{docId} {
      allow read, write: if true;
    }
    
    match /contact/{docId} {
      allow read, write: if true;
    }
  }
}`;

// Escrever regras temporárias
fs.writeFileSync('firestore.rules', regrasTemporrarias, 'utf8');
console.log('✅ Regras temporárias aplicadas');

console.log('');
console.log('📋 PRÓXIMOS PASSOS:');
console.log('1. Faça deploy das regras: firebase deploy --only firestore:rules');
console.log('2. Execute a migração: node enviar_para_firebase.js');
console.log('3. Restaure as regras: node restaurar_regras.js');
console.log('');
console.log('⚠️  IMPORTANTE: Lembre-se de restaurar as regras após a migração!');
