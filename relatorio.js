const data = require('./posts_migrados.json');

console.log('RELATÓRIO DETALHADO DA MIGRAÇÃO');
console.log('='.repeat(40));
console.log(`Total de posts: ${data.length}`);
console.log(`Tamanho médio do conteúdo: ${Math.round(data.reduce((acc, post) => acc + post.content.length, 0) / data.length)} caracteres`);

const longestPost = data.reduce((longest, post) => post.content.length > longest.content.length ? post : longest);
console.log(`Post com mais conteúdo: "${longestPost.title.substring(0, 60)}${longestPost.title.length > 60 ? '...' : ''}"`);

console.log(`Posts com categorias: ${data.filter(p => p.categories.length > 0).length}`);

const dates = data.map(p => new Date(p.publishedDate));
const minDate = new Date(Math.min(...dates));
const maxDate = new Date(Math.max(...dates));
console.log(`Período: ${minDate.toLocaleDateString('pt-BR')} a ${maxDate.toLocaleDateString('pt-BR')}`);

console.log('\nMigração concluída com sucesso! ✅');
