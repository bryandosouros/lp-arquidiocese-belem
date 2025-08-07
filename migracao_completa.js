const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Função para executar comandos
async function executarComando(comando, descricao) {
    console.log(`🔧 ${descricao}...`);
    try {
        const { stdout, stderr } = await execAsync(comando);
        if (stderr && !stderr.includes('Warning')) {
            console.warn('⚠️  Aviso:', stderr);
        }
        if (stdout) {
            console.log('📋', stdout.trim());
        }
        return true;
    } catch (error) {
        console.error(`❌ Erro ao ${descricao.toLowerCase()}:`, error.message);
        return false;
    }
}

// Função para fazer backup das regras atuais
function fazerBackupRegras() {
    if (fs.existsSync('firestore.rules')) {
        fs.copyFileSync('firestore.rules', 'firestore.rules.backup');
        console.log('✅ Backup das regras atuais criado: firestore.rules.backup');
    }
}

// Função para restaurar as regras originais
function restaurarRegras() {
    if (fs.existsSync('firestore.rules.backup')) {
        fs.copyFileSync('firestore.rules.backup', 'firestore.rules');
        console.log('✅ Regras originais restauradas');
    }
}

// Função para aplicar regras temporárias
function aplicarRegrasTemporrarias() {
    if (fs.existsSync('firestore.rules.temp')) {
        fs.copyFileSync('firestore.rules.temp', 'firestore.rules');
        console.log('✅ Regras temporárias aplicadas');
        return true;
    }
    return false;
}

// Função principal de migração completa
async function migracaoCompleta() {
    console.log('🚀 MIGRAÇÃO COMPLETA PARA FIREBASE');
    console.log('==================================');
    console.log('Este script irá:');
    console.log('1. Fazer backup das regras atuais');
    console.log('2. Aplicar regras temporárias (menos restritivas)');
    console.log('3. Fazer deploy das novas regras');
    console.log('4. Executar a migração dos posts');
    console.log('5. Restaurar as regras originais');
    console.log('6. Fazer deploy das regras originais');
    console.log('');
    
    try {
        // Passo 1: Backup das regras
        console.log('📋 PASSO 1: Fazendo backup das regras...');
        fazerBackupRegras();
        
        // Passo 2: Aplicar regras temporárias
        console.log('\n📋 PASSO 2: Aplicando regras temporárias...');
        if (!aplicarRegrasTemporrarias()) {
            throw new Error('Arquivo firestore.rules.temp não encontrado');
        }
        
        // Passo 3: Deploy das regras temporárias
        console.log('\n📋 PASSO 3: Fazendo deploy das regras temporárias...');
        const deployRegrasOk = await executarComando(
            'firebase deploy --only firestore:rules',
            'Fazendo deploy das regras temporárias'
        );
        
        if (!deployRegrasOk) {
            throw new Error('Falha ao fazer deploy das regras temporárias');
        }
        
        // Aguardar um pouco para as regras serem aplicadas
        console.log('⏳ Aguardando aplicação das regras (5 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Passo 4: Executar migração
        console.log('\n📋 PASSO 4: Executando migração dos posts...');
        const migracaoOk = await executarComando(
            'node enviar_para_firebase.js',
            'Executando migração dos posts'
        );
        
        if (!migracaoOk) {
            console.error('❌ Migração falhou, mas vamos restaurar as regras...');
        }
        
        // Passo 5: Restaurar regras originais
        console.log('\n📋 PASSO 5: Restaurando regras originais...');
        restaurarRegras();
        
        // Passo 6: Deploy das regras originais
        console.log('\n📋 PASSO 6: Fazendo deploy das regras originais...');
        await executarComando(
            'firebase deploy --only firestore:rules',
            'Fazendo deploy das regras originais'
        );
        
        if (migracaoOk) {
            console.log('\n🎉 MIGRAÇÃO COMPLETA REALIZADA COM SUCESSO!');
            console.log('✅ Posts enviados para o Firebase');
            console.log('✅ Regras de segurança restauradas');
        } else {
            console.log('\n⚠️  MIGRAÇÃO FALHOU, MAS REGRAS FORAM RESTAURADAS');
        }
        
    } catch (error) {
        console.error('\n💥 Erro durante a migração:', error.message);
        
        // Tentar restaurar regras em caso de erro
        console.log('\n🔧 Tentando restaurar regras originais...');
        restaurarRegras();
        await executarComando(
            'firebase deploy --only firestore:rules',
            'Restaurando regras originais após erro'
        );
        
        console.log('\n❌ Migração falhou, mas regras foram restauradas para segurança.');
        process.exit(1);
    }
}

// Executar migração
migracaoCompleta();
