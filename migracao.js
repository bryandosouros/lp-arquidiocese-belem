const fs = require('fs');
const xml2js = require('xml2js');
const he = require('he');

// Função para criar slug a partir do título
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD') // Decomposição Unicode para remover acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas (acentos)
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

// Função principal de migração
async function migrarPosts() {
  try {
    console.log('🚀 Iniciando migração dos posts...');
    
    // Definir o caminho do arquivo de entrada
    const feedPath = './backup/feed.atom';
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(feedPath)) {
      throw new Error(`Arquivo ${feedPath} não encontrado!`);
    }
    
    // Ler o arquivo feed.atom
    console.log('📖 Lendo arquivo feed.atom...');
    const xmlData = fs.readFileSync(feedPath, 'utf8');
    
    // Configurar o parser XML
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      trim: true
    });
    
    // Converter XML para objeto JavaScript
    console.log('🔄 Convertendo XML para objeto JavaScript...');
    const result = await parser.parseStringPromise(xmlData);
    
    // Verificar se existem entries no feed
    if (!result.feed || !result.feed.entry) {
      throw new Error('Nenhum post encontrado no arquivo feed.atom');
    }
    
    // Garantir que entry seja um array
    const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
    
    console.log(`📝 Processando ${entries.length} posts...`);
    
    // Array para armazenar os posts processados
    const postsMigrados = [];
    
    // Processar cada entry (post)
    entries.forEach((entry, index) => {
      try {
        // Extrair dados básicos
        const title = entry.title || `Post sem título ${index + 1}`;
        
        // Tratar o conteúdo de forma mais robusta
        let content = '';
        if (entry.content) {
          if (typeof entry.content === 'string') {
            content = he.decode(entry.content);
          } else if (entry.content._ && typeof entry.content._ === 'string') {
            content = he.decode(entry.content._);
          } else if (entry.content.toString) {
            content = he.decode(entry.content.toString());
          }
        }
        
        const publishedDate = entry.published || entry['blogger:created'] || new Date().toISOString();
        const author = entry.author?.name || 'Autor desconhecido';
        const slug = createSlug(title);
        
        // Extrair categorias/tags se existirem
        let categories = [];
        if (entry.category) {
          if (Array.isArray(entry.category)) {
            categories = entry.category.map(cat => cat.term || cat).filter(Boolean);
          } else {
            categories = [entry.category.term || entry.category].filter(Boolean);
          }
        }
        
        // Criar objeto do post
        const post = {
          id: `post-${index + 1}`,
          title: title.trim(),
          content: content.trim(),
          publishedDate,
          slug,
          author,
          categories,
          originalId: entry.id || null,
          bloggerFilename: entry['blogger:filename'] || null,
          status: entry['blogger:status'] || 'PUBLISHED',
          createdDate: entry['blogger:created'] || publishedDate,
          updatedDate: entry.updated || publishedDate
        };
        
        postsMigrados.push(post);
        
        console.log(`✅ Post processado: "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`);
        
      } catch (error) {
        console.error(`❌ Erro ao processar post ${index + 1}:`, error.message);
      }
    });
    
    // Converter array para JSON formatado
    console.log('💾 Convertendo para JSON...');
    const jsonContent = JSON.stringify(postsMigrados, null, 2);
    
    // Salvar arquivo JSON
    const outputPath = './posts_migrados.json';
    fs.writeFileSync(outputPath, jsonContent, 'utf8');
    
    // Relatório final
    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('═'.repeat(50));
    console.log(`📊 Total de posts processados: ${postsMigrados.length}`);
    console.log(`📁 Arquivo gerado: ${outputPath}`);
    console.log(`📏 Tamanho do arquivo: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
    // Mostrar estatísticas dos autores
    const autores = [...new Set(postsMigrados.map(post => post.author))];
    console.log(`👥 Autores encontrados: ${autores.length}`);
    autores.forEach(autor => {
      const quantidade = postsMigrados.filter(post => post.author === autor).length;
      console.log(`   - ${autor}: ${quantidade} post(s)`);
    });
    
    // Mostrar estatísticas das categorias
    const todasCategorias = postsMigrados.flatMap(post => post.categories);
    const categoriasUnicas = [...new Set(todasCategorias)];
    console.log(`🏷️  Categorias encontradas: ${categoriasUnicas.length}`);
    if (categoriasUnicas.length > 0) {
      console.log(`   Principais: ${categoriasUnicas.slice(0, 5).join(', ')}`);
    }
    
    console.log('\n📋 Para executar o script novamente, use:');
    console.log('   node migracao.js');
    console.log('\n📄 Para visualizar os posts migrados:');
    console.log(`   type ${outputPath} | more`);
    
  } catch (error) {
    console.error('💥 Erro durante a migração:', error.message);
    process.exit(1);
  }
}

// Executar a migração
migrarPosts();
