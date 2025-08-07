const fs = require('fs');

console.log('🔧 RESTAURANDO REGRAS ORIGINAIS');
console.log('================================');

if (fs.existsSync('firestore.rules.backup')) {
    fs.copyFileSync('firestore.rules.backup', 'firestore.rules');
    console.log('✅ Regras originais restauradas');
    
    console.log('');
    console.log('📋 PRÓXIMO PASSO:');
    console.log('Faça deploy das regras restauradas: firebase deploy --only firestore:rules');
    console.log('');
    console.log('✅ Migração segura concluída!');
} else {
    console.log('❌ Arquivo de backup não encontrado: firestore.rules.backup');
    console.log('Por favor, restaure as regras manualmente.');
}
