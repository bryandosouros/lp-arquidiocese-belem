import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBUuKIfxUXGHIPH2eQBwUggWawexQ3-L5A",
    authDomain: "belem-hb.firebaseapp.com",
    projectId: "belem-hb",
    storageBucket: "belem-hb.firebasestorage.app",
    messagingSenderId: "669142237239",
    appId: "1:669142237239:web:9fa0de02efe4da6865ffb2",
    measurementId: "G-92E26Y6HB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Load and display post
async function loadPost() {
    if (!postId) {
        showError('Post não encontrado');
        return;
    }

    try {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const post = docSnap.data();
            renderPost(post);
        } else {
            showError('Post não encontrado');
        }
    } catch (error) {
        console.error('Error loading post:', error);
        showError('Erro ao carregar o post');
    }
}

function renderPost(post) {
    // Update page meta using SEO Manager if available
    const pageTitle = `${post.title} - Arquidiocese de Belém do Pará`;
    const pageDescription = post.metaDescription || post.excerpt || extractExcerpt(post.content) || 'Arquidiocese de Belém do Pará';
    const pageKeywords = post.tags ? post.tags.concat(['Arquidiocese', 'Belém', 'Pará']) : ['Arquidiocese', 'Belém', 'Pará', 'Igreja Católica'];
    
    // Update traditional meta tags
    document.getElementById('post-title-meta').textContent = pageTitle;
    document.getElementById('post-description-meta').content = pageDescription;
    
    // Use SEO Manager for comprehensive SEO updates
    if (window.seoManager) {
        window.seoManager.updatePageSEO({
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            author: post.author || 'Arquidiocese de Belém do Pará',
            image: post.image || `${window.location.origin}/images/logo-arquidiocese-belem.png`,
            structuredData: {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": post.title,
                "description": pageDescription,
                "author": {
                    "@type": "Organization",
                    "name": post.author || "Arquidiocese de Belém do Pará"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Arquidiocese de Belém do Pará",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${window.location.origin}/images/logo-arquidiocese-belem.png`
                    }
                },
                "datePublished": post.createdAt ? new Date(post.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
                "dateModified": post.updatedAt ? new Date(post.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": window.location.href
                },
                "image": post.image || `${window.location.origin}/images/logo-arquidiocese-belem.png`,
                "articleSection": post.category || "Religious",
                "inLanguage": "pt-BR"
            }
        });
    } else {
        // Fallback to manual meta tag updates
        updateFallbackMetaTags(post);
    }

    // Update SEO meta tags
    if (typeof window.updatePostSEO === 'function') {
        window.updatePostSEO({
            id: postId,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || extractExcerpt(post.content),
            featuredImage: post.featuredImage,
            category: post.category,
            tags: post.tags,
            // Usar campos compatíveis com posts migrados
            createdAt: post.createdDate || post.publishedDate || post.createdAt,
            updatedAt: post.updatedAt || post.createdDate || post.publishedDate,
            publishedAt: post.publishedDate || post.createdDate || post.createdAt
        });
    }

    // Render post content
    const container = document.getElementById('post-container');
    container.innerHTML = `
        <header class="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            <nav class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Início</a>
                <span class="mx-2">›</span>
                <a href="/#noticias" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Notícias</a>
                <span class="mx-2">›</span>
                <span class="text-gray-700 dark:text-gray-300">${getCategoryLabel(post.category)}</span>
            </nav>
            
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 text-sm font-medium rounded-full">${getCategoryLabel(post.category)}</span>
                <time class="text-gray-500 dark:text-gray-400 text-sm">${formatDate(post.createdAt)}</time>
                ${post.priority && post.priority !== 'normal' ? `<span class="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 text-sm font-medium rounded-full">${getPriorityLabel(post.priority)}</span>` : ''}
            </div>
            
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">${post.title}</h1>
            
            ${post.excerpt ? `<div class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">${post.excerpt}</div>` : ''}
            
            ${post.featuredImage ? `
                <div class="mb-6 rounded-lg overflow-hidden">
                    <img src="${post.featuredImage}" alt="${post.title}" class="w-full h-64 md:h-80 object-cover">
                </div>
            ` : ''}
        </header>
        
        <div class="p-6 md:p-8">
            <div class="prose prose-lg max-w-none dark:prose-invert prose-blue dark:prose-dark">
                ${processPostContent(post.content) || '<p>Conteúdo não disponível.</p>'}
            </div>
        </div>
        
        ${post.tags && post.tags.length > 0 ? `
            <footer class="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-gray-700 dark:text-gray-300 font-medium text-sm">Tags:</span>
                    ${post.tags.map(tag => `<span class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">${tag}</span>`).join('')}
                </div>
            </footer>
        ` : ''}
        
        <div class="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700">
            <a href="/#noticias" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <i class="fas fa-arrow-left"></i>
                Voltar às Notícias
            </a>
        </div>
    `;
}

function processPostContent(content) {
    if (!content) return null;
    
    // Usar proxy de imagens para resolver CORS do Blogger
    let processedContent = content.replace(
        /src="([^"]*blogger\.googleusercontent\.com[^"]*)"/g,
        (match, url) => {
            // Usar proxy CORS para imagens do Blogger
            const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=800&q=85&output=webp&fallback=jpg`;
            return `src="${proxyUrl}" data-original="${url}" onerror="if(this.dataset.original && this.src!==this.dataset.original){this.src=this.dataset.original}else{this.style.display='none'}"`;
        }
    );
    
    // Preservar estilos de centralização do Blogger
    processedContent = processedContent.replace(
        /<div class="separator" style="[^"]*text-align:\s*center[^"]*">/g,
        '<div class="separator" style="clear: both; text-align: center; margin: 1rem 0;">'
    );
    
    // Adicionar centralização para imagens órfãs sem div
    processedContent = processedContent.replace(
        /<img([^>]*)(style="[^"]*")/g,
        (match, imgAttrs, style) => {
            if (!style.includes('text-align')) {
                const newStyle = style.replace('style="', 'style="display: block; margin: 0 auto; ');
                return `<img${imgAttrs}${newStyle}`;
            }
            return match;
        }
    );
    
    // Para imagens sem style, adicionar centralização
    processedContent = processedContent.replace(
        /<img(?![^>]*style=)([^>]*)>/g,
        '<img$1 style="display: block; margin: 0 auto; max-width: 100%; height: auto;">'
    );
    
    return processedContent;
}

function updateFallbackMetaTags(post) {
    // Manual meta tag updates when SEO Manager is not available
    const pageDescription = post.metaDescription || post.excerpt || extractExcerpt(post.content) || 'Arquidiocese de Belém do Pará';
    
    // Update Open Graph
    document.getElementById('og-title').content = `${post.title} - Arquidiocese de Belém do Pará`;
    document.getElementById('og-description').content = pageDescription;
    document.getElementById('og-url').content = window.location.href;
    document.getElementById('og-image').content = post.image || `${window.location.origin}/images/logo-arquidiocese-belem.png`;
    
    // Update Twitter Cards
    document.getElementById('twitter-title').content = `${post.title} - Arquidiocese de Belém do Pará`;
    document.getElementById('twitter-description').content = pageDescription;
    document.getElementById('twitter-image').content = post.image || `${window.location.origin}/images/logo-arquidiocese-belem.png`;
    
    // Update Structured Data
    const structuredDataScript = document.getElementById('structured-data');
    if (structuredDataScript) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": pageDescription,
            "author": {
                "@type": "Organization",
                "name": post.author || "Arquidiocese de Belém do Pará"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Arquidiocese de Belém do Pará",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${window.location.origin}/images/logo-arquidiocese-belem.png`
                }
            },
            "datePublished": post.createdAt ? new Date(post.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
            "dateModified": post.updatedAt ? new Date(post.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            },
            "image": post.image || `${window.location.origin}/images/logo-arquidiocese-belem.png`
        };
        structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
    }
}

function showError(message) {
    const container = document.getElementById('post-container');
    container.innerHTML = `
        <div class="flex items-center justify-center p-12">
            <div class="text-center max-w-md">
                <div class="text-6xl mb-4">⚠️</div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Oops! Algo deu errado</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
                <a href="/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-1 inline-flex items-center gap-2">
                    <i class="fas fa-home"></i>
                    Voltar ao Início
                </a>
            </div>
        </div>
    `;
}

function getCategoryLabel(category) {
    const labels = {
        'decretos': 'Decretos',
        'comunicados': 'Comunicados',
        'noticias': 'Notícias',
        'homilias': 'Homilias'
    };
    return labels[category] || 'Notícias';
}

function getPriorityLabel(priority) {
    const labels = {
        'high': 'Alta Prioridade',
        'normal': 'Prioridade Normal',
        'low': 'Baixa Prioridade'
    };
    return labels[priority] || priority;
}

function formatDate(date) {
    if (!date) return '';
    
    let dateObj;
    if (date.seconds) {
        dateObj = new Date(date.seconds * 1000);
    } else {
        dateObj = new Date(date);
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function extractExcerpt(content) {
    if (!content) return 'Clique para ler o conteúdo completo...';
    
    // Remove HTML tags e pega os primeiros 200 caracteres
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 200 ? 
        textContent.substring(0, 200) + '...' : 
        textContent;
}

// Load post when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
    
    // Update footer year
    document.getElementById('ano-atual').textContent = new Date().getFullYear();
});
