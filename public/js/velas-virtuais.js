// Velas Virtuais - Arquidiocese de Belém do Pará
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

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

class VelasVirtuais {
    constructor() {
        this.velaAtual = null;
        this.tipos = [
            {
                id: 'branca',
                nome: 'Vela Branca',
                cor: 'Branca',
                oracao: 'Senhor Jesus, luz do mundo, iluminai meu caminho e dai-me a paz que só Vós podeis dar. Que esta luz represente minha fé e esperança em Vosso amor infinito.',
                proposito: 'Paz, Purificação e Proteção',
                gif: 'images/velas/vela-branca.svg',
                classe: 'vela-branca'
            },
            {
                id: 'vermelha',
                nome: 'Vela Vermelha',
                cor: 'Vermelha',
                oracao: 'Sagrado Coração de Jesus, fonte de todo amor, aquecei meu coração com Vosso amor divino. Que esta chama represente minha paixão por Vós e por todos que amo.',
                proposito: 'Amor, Paixão e Força Espiritual',
                gif: 'images/velas/vela-vermelha.svg',
                classe: 'vela-vermelha'
            },
            {
                id: 'azul',
                nome: 'Vela Azul',
                cor: 'Azul',
                oracao: 'Nossa Senhora de Nazaré, Mãe querida, cobri-me com vosso manto de proteção. Que esta luz azul simbolize minha devoção e confiança em vossa intercessão maternal.',
                proposito: 'Proteção Materna e Serenidade',
                gif: 'images/velas/vela-azul.svg',
                classe: 'vela-azul'
            },
            {
                id: 'verde',
                nome: 'Vela Verde',
                cor: 'Verde',
                oracao: 'Espírito Santo, renovai em mim a esperança e a fé. Que esta vela verde simbolize o crescimento espiritual e a vida nova que só Vós podeis dar.',
                proposito: 'Esperança, Cura e Renovação',
                gif: 'images/velas/vela-verde.svg',
                classe: 'vela-verde'
            },
            {
                id: 'amarela',
                nome: 'Vela Amarela',
                cor: 'Amarela',
                oracao: 'São José, guardião da Sagrada Família, protegei minha família e intercedei por nossas necessidades. Que esta luz dourada traga prosperidade e proteção ao nosso lar.',
                proposito: 'Prosperidade e Proteção Familiar',
                gif: 'images/velas/vela-amarela.svg',
                classe: 'vela-amarela'
            },
            {
                id: 'roxa',
                nome: 'Vela Roxa',
                cor: 'Roxa',
                oracao: 'Senhor, acolhei as almas dos nossos entes queridos que partiram para a Casa do Pai. Que esta vela roxa seja símbolo de nossa oração pelos que já não estão entre nós.',
                proposito: 'Intenções pelos Falecidos e Transformação',
                gif: 'images/velas/vela-roxa.svg',
                classe: 'vela-roxa'
            }
        ];
        this.init();
    }

    init() {
        console.log('🕯️ Iniciando sistema de Velas Virtuais...');
        this.renderizarVelas();
        this.carregarEstatisticas();
        this.carregarOracoesRecentes();
        this.setupEventListeners();
    }

    renderizarVelas() {
        const container = document.getElementById('velas-container');
        if (!container) return;

        container.innerHTML = '';

        this.tipos.forEach(vela => {
            const velaElement = this.criarElementoVela(vela);
            container.appendChild(velaElement);
        });
    }

    criarElementoVela(vela) {
        const div = document.createElement('div');
        div.className = `vela-container ${vela.classe} rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl`;
        
        div.innerHTML = `
            <div class="mb-6">
                <img src="${vela.gif}" alt="Vela ${vela.cor}" class="vela-gif mx-auto flame-animation">
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">${vela.nome}</h3>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">${vela.proposito}</p>
            
            <div class="oracao-texto text-sm text-gray-700 dark:text-gray-300 mb-6 min-h-[80px] flex items-center">
                "${vela.oracao}"
            </div>
            
            <div class="contador-velas mb-4" id="contador-${vela.id}">
                <i class="fas fa-fire text-orange-500 mr-2"></i>
                <span class="count">0</span> velas ativas
            </div>
            
            <div class="flex gap-3">
                <button class="btn-acender flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" data-vela="${vela.id}">
                    🕯️ Acender
                </button>
                <button class="btn-ver-acesas flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" data-vela="${vela.id}">
                    👁️ Ver Acesas
                </button>
            </div>
        `;

        return div;
    }

    setupEventListeners() {
        // Botões para acender velas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-acender') || e.target.closest('.btn-acender')) {
                const btn = e.target.classList.contains('btn-acender') ? e.target : e.target.closest('.btn-acender');
                const velaId = btn.getAttribute('data-vela');
                this.abrirModalVela(velaId);
            }
        });

        // Modal events
        const modal = document.getElementById('modal-vela');
        const btnCancelar = document.getElementById('btn-cancelar');
        const form = document.getElementById('form-vela');

        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => this.fecharModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.fecharModal();
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmitVela(e));
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharModal();
        });
    }

    abrirModalVela(velaId) {
        const vela = this.tipos.find(v => v.id === velaId);
        if (!vela) return;

        this.velaAtual = vela;
        
        const modal = document.getElementById('modal-vela');
        const titulo = document.getElementById('modal-titulo');
        const subtitulo = document.getElementById('modal-subtitulo');
        const img = document.getElementById('modal-vela-img');

        if (titulo) titulo.textContent = `Acender ${vela.nome}`;
        if (subtitulo) subtitulo.textContent = vela.proposito;
        if (img) img.src = vela.gif;

        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        // Focus no campo de oração
        setTimeout(() => {
            const oracao = document.getElementById('oracao');
            if (oracao) oracao.focus();
        }, 100);
    }

    fecharModal() {
        const modal = document.getElementById('modal-vela');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        
        // Limpar formulário
        const form = document.getElementById('form-vela');
        if (form) form.reset();
        
        this.velaAtual = null;
    }

    async handleSubmitVela(e) {
        e.preventDefault();
        
        if (!this.velaAtual) return;

        const form = e.target;
        const formData = new FormData(form);
        const nome = formData.get('nome') || 'Anônimo';
        const oracao = formData.get('oracao');
        const periodicidade = parseInt(formData.get('periodicidade')) || 1;

        if (!oracao.trim()) {
            alert('Por favor, escreva sua oração.');
            return;
        }

        if (periodicidade < 1 || periodicidade > 30) {
            alert('A periodicidade deve ser entre 1 e 30 dias.');
            return;
        }

        try {
            // Calcular data de expiração
            const agora = new Date();
            const dataExpiracao = new Date(agora.getTime() + (periodicidade * 24 * 60 * 60 * 1000));

            // Salvar no Firebase
            await addDoc(collection(db, 'velas-virtuais'), {
                tipo: this.velaAtual.id,
                nome: nome,
                oracao: oracao,
                periodicidade: periodicidade,
                dataInicio: serverTimestamp(),
                dataExpiracao: dataExpiracao.toISOString(),
                ativa: true,
                timestamp: serverTimestamp(),
                data: new Date().toISOString()
            });

            // Mostrar mensagem de sucesso
            this.mostrarSucesso(periodicidade);
            
            // Atualizar contadores
            this.carregarEstatisticas();
            this.carregarOracoesRecentes();
            
        } catch (error) {
            console.error('Erro ao acender vela:', error);
            alert('Erro ao acender a vela. Tente novamente.');
        }
    }

    mostrarSucesso(periodicidade = 1) {
        this.fecharModal();
        
        // Criar notificação de sucesso
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        
        const diasTexto = periodicidade === 1 ? '1 dia' : `${periodicidade} dias`;
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-fire text-yellow-300 text-xl"></i>
                <div>
                    <div class="font-semibold">Vela Acesa com Sucesso!</div>
                    <div class="text-sm opacity-90">Sua oração ficará acesa por ${diasTexto} 🙏</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    async carregarEstatisticas() {
        try {
            const q = query(collection(db, 'velas-virtuais'));
            const querySnapshot = await getDocs(q);
            
            const agora = new Date();
            const hoje = agora.toDateString();
            let totalVelas = querySnapshot.size;
            let velasAtivas = 0;
            let velasHoje = 0;
            const contadores = {};
            
            // Inicializar contadores
            this.tipos.forEach(vela => {
                contadores[vela.id] = { total: 0, ativo: 0 };
            });
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const velaData = new Date(data.data).toDateString();
                const dataExpiracao = data.dataExpiracao ? new Date(data.dataExpiracao) : null;
                const velaAtiva = !dataExpiracao || dataExpiracao > agora;
                
                // Contar velas de hoje
                if (velaData === hoje) {
                    velasHoje++;
                }
                
                // Contar velas ativas
                if (velaAtiva) {
                    velasAtivas++;
                }
                
                // Contadores por tipo
                if (contadores.hasOwnProperty(data.tipo)) {
                    contadores[data.tipo].total++;
                    if (velaAtiva) {
                        contadores[data.tipo].ativo++;
                    }
                }
            });
            
            // Atualizar interface
            const totalVelasEl = document.getElementById('total-velas');
            const velasAtivasEl = document.getElementById('velas-ativas');
            const velasHojeEl = document.getElementById('velas-hoje');
            
            if (totalVelasEl) totalVelasEl.textContent = totalVelas;
            if (velasAtivasEl) velasAtivasEl.textContent = velasAtivas;
            if (velasHojeEl) velasHojeEl.textContent = velasHoje;
            
            // Atualizar contadores individuais (mostrar velas ativas)
            Object.keys(contadores).forEach(tipo => {
                const contador = document.getElementById(`contador-${tipo}`);
                if (contador) {
                    const span = contador.querySelector('.count');
                    if (span) span.textContent = contadores[tipo].ativo;
                }
            });
            
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    async carregarOracoesRecentes() {
        try {
            const q = query(
                collection(db, 'velas-virtuais'), 
                orderBy('timestamp', 'desc'), 
                limit(12)
            );
            const querySnapshot = await getDocs(q);
            
            const container = document.getElementById('oracoes-recentes');
            if (!container) return;
            
            container.innerHTML = '';
            
            if (querySnapshot.empty) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-6xl mb-4">🕯️</div>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Seja o primeiro a acender uma vela</h3>
                        <p class="text-gray-600 dark:text-gray-400">Comece agora mesmo fazendo sua oração</p>
                    </div>
                `;
                return;
            }
            
            const agora = new Date();
            let velasAtivas = 0;
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const vela = this.tipos.find(v => v.id === data.tipo);
                if (!vela) return;
                
                // Verificar se a vela ainda está ativa
                const dataExpiracao = data.dataExpiracao ? new Date(data.dataExpiracao) : null;
                const velaAtiva = !dataExpiracao || dataExpiracao > agora;
                
                // Só mostrar até 6 velas ativas
                if (!velaAtiva || velasAtivas >= 6) return;
                velasAtivas++;
                
                const timeAgo = this.getTimeAgo(data.timestamp?.toDate() || new Date(data.data));
                const diasRestantes = dataExpiracao ? Math.ceil((dataExpiracao - agora) / (1000 * 60 * 60 * 24)) : null;
                
                const oracaoCard = document.createElement('div');
                oracaoCard.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4';
                
                // Cor da borda baseada no tipo de vela
                const bordaCores = {
                    'branca': 'border-gray-300',
                    'vermelha': 'border-red-500',
                    'azul': 'border-blue-500',
                    'verde': 'border-green-500',
                    'amarela': 'border-yellow-500',
                    'roxa': 'border-purple-500'
                };
                
                oracaoCard.className += ` ${bordaCores[vela.id] || 'border-gray-300'}`;
                
                const statusVela = velaAtiva ? 
                    `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        ${diasRestantes ? `${diasRestantes}d restantes` : 'Ativa'}
                    </span>` : 
                    `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        <span class="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                        Apagada
                    </span>`;
                
                oracaoCard.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <img src="${vela.gif}" alt="Vela ${vela.cor}" class="w-8 h-8 flame-animation">
                            <div>
                                <div class="font-semibold text-gray-800 dark:text-gray-200">${data.nome}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">${vela.nome} • ${timeAgo}</div>
                            </div>
                        </div>
                        ${statusVela}
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        "${data.oracao.length > 120 ? data.oracao.substring(0, 120) + '...' : data.oracao}"
                    </p>
                `;
                
                container.appendChild(oracaoCard);
            });
            
            // Se não há velas ativas para mostrar
            if (velasAtivas === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-6xl mb-4">🕯️</div>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Nenhuma vela ativa no momento</h3>
                        <p class="text-gray-600 dark:text-gray-400">Acenda uma vela e mantenha a chama da fé acesa</p>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Erro ao carregar orações recentes:', error);
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 30) return `${diffDays}d atrás`;
        
        return date.toLocaleDateString('pt-BR');
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new VelasVirtuais();
});

console.log('🕯️ Sistema de Velas Virtuais carregado!');
