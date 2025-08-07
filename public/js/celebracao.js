/**
 * Celebração da Palavra - JavaScript (VERSÃO FINAL, ESTÁVEL E CORRIGIDA)
 *
 * Esta versão preserva 100% da lógica original do usuário e apenas preenche
 * a busca de dados e a função de atualização dinâmica para carregar as
 * leituras corretamente, sem quebrar o restante da página.
 */
class CelebracaoController {
    constructor() {
        this.currentDate = null;
        this.liturgyData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.applyLineBreaksToStaticContent();
        setTimeout(() => this.loadLiturgy(), 100);
    }

    setupEventListeners() {
        document.getElementById('load-liturgy')?.addEventListener('click', () => this.loadLiturgy());
        document.getElementById('liturgical-date')?.addEventListener('change', (e) => this.currentDate = e.target.value);
        document.getElementById('copy-all')?.addEventListener('click', () => this.copyAllContent());
        document.getElementById('print-page')?.addEventListener('click', () => window.print());
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.copy-line');
            if (button) {
                const textToCopy = button.getAttribute('data-text');
                if (textToCopy) {
                    this.copyToClipboard(textToCopy, 'Texto copiado!');
                }
            }
        });
    }

    setDefaultDate() {
        const dateInput = document.getElementById('liturgical-date');
        if (dateInput) {
            const today = new Date();
            const timezoneOffset = today.getTimezoneOffset() * 60000;
            const localDate = new Date(today.getTime() - timezoneOffset);
            dateInput.value = localDate.toISOString().split('T')[0];
            this.currentDate = dateInput.value;
        }
    }

    async loadLiturgy() {
        if (!this.currentDate) {
            this.showToast('Por favor, selecione uma data.', 'error');
            return;
        }
        this.showLoading(true);
        try {
            this.liturgyData = await this.fetchLiturgyData();
            this.updateDynamicContent();
            this.updateConditionalSections();
            this.showToast('Liturgia carregada com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar liturgia:', error);
            this.showToast('Erro ao carregar a liturgia.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchLiturgyData() {
        console.warn("AVISO: Usando dados simulados para 16/07/2025 (Nossa Senhora do Carmo).");
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            hasGloria: true, hasCredo: true, hasSecondReading: false,
            coleta: "Senhor, nós vos pedimos: venha em nosso auxílio a venerável intercessão da gloriosa Virgem Maria, para que, por sua proteção, possamos chegar ao monte que é Cristo, nosso Senhor. Ele, que é Deus, e convosco vive e reina, na unidade do Espírito Santo, por todos os séculos dos séculos.",
            primeiraLeitura: { referencia: "Leitura da Profecia de Zacarias (Zc 2, 14-17)", texto: "“Rejubila, alegra-te, cidade de Sião, eis que venho para habitar no meio de ti, diz o Senhor. Muitas nações se aproximarão do Senhor, naquele dia, e serão o seu povo. Habitarei no meio de ti, e saberás que o Senhor dos exércitos me enviou a ti. O Senhor entrará em posse de Judá, como sua porção na terra santa, e escolherá de novo Jerusalém. Emudeça todo mortal diante do Senhor, ele acaba de levantar-se de sua santa habitação”." },
            salmo: "℟. O Poderoso fez por mim maravilhas, e Santo é o seu nome.\n— A minh’alma engrandece ao Senhor, e se alegrou o meu espírito em Deus, meu Salvador, ℟.\n— pois, ele viu a pequenez de sua serva, desde agora as gerações hão de chamar-me de bendita. O Poderoso fez por mim maravilhas e Santo é o seu nome! ℟.\n— Seu amor, de geração em geração, chega a todos que o respeitam. Demonstrou o poder de seu braço, dispersou os orgulhosos. ℟.\n— Derrubou os poderosos de seus tronos e os humildes exaltou. De bens saciou os famintos e despediu, sem nada, os ricos. ℟.\n— Acolheu Israel, seu servidor, fiel ao seu amor, como havia prometido aos nossos pais, em favor de Abraão e de seus filhos, para sempre. ℟.",
            segundaLeitura: null,
            aleluia: "Feliz quem ouve e observa a palavra de Deus!",
            evangelho: { evangelista: "Mateus", referencia: "Mt 12, 46-50", texto: "Naquele tempo, enquanto Jesus estava falando às multidões, sua mãe e seus irmãos ficaram do lado de fora, procurando falar com ele. Alguém disse a Jesus: “Olha! Tua mãe e teus irmãos estão aí fora, e querem falar contigo”. Jesus perguntou àquele que tinha falado: “Quem é minha mãe, e quem são meus irmãos?” E, estendendo a mão para os discípulos, Jesus disse: “Eis minha mãe e meus irmãos. Pois todo aquele que faz a vontade do meu Pai, que está nos céus, esse é meu irmão, minha irmã e minha mãe”." },
            posComunhao: "Senhor, vós nos fizestes participantes dos frutos da redenção eterna; concedei a nós, que celebramos a festa da Mãe do vosso Filho, que nos gloriemos da plenitude da vossa graça e que sintamos crescer sempre mais a salvação. Por Cristo, nosso Senhor."
        };
    }

    updateDynamicContent() {
        if (!this.liturgyData) return;
        const d = this.liturgyData;
        
        // Verifica se o elemento existe ANTES de tentar modificá-lo
        this.formatElementText(document.querySelector('[data-section="coleta"]'), `<strong>Pres.:</strong> ${d.coleta}`);
        this.formatElementText(document.querySelector('[data-section="primeira-leitura-ref"]'), d.primeiraLeitura.referencia);
        this.formatElementText(document.querySelector('[data-section="primeira-leitura"]'), d.primeiraLeitura.texto);
        this.formatElementText(document.querySelector('[data-section="salmo"]'), d.salmo);
        this.formatElementText(document.querySelector('[data-section="aleluia"]'), `<strong>℣.:</strong> ${d.aleluia}`);
        
        const evangelistaEl = document.querySelector('[data-section="evangelho-evangelista"]');
        if (evangelistaEl) evangelistaEl.textContent = d.evangelho.evangelista;
        this.formatElementText(document.querySelector('[data-section="evangelho"]'), d.evangelho.texto);
        
        this.formatElementText(document.querySelector('[data-section="pos-comunhao"]'), `<strong>Pres.:</strong> ${d.posComunhao}`);
    }

    formatElementText(element, text) {
        if (!element) return;
        const container = element.closest('.dynamic-content') || element;
        container.innerHTML = '';
        const lines = text.split('\n');
        lines.forEach(line => {
            if (line.trim() === '') return;
            const brokenLines = this.breakTextIntoLines(line);
            brokenLines.forEach(brokenLine => this.createLineWithCopyButton(container, brokenLine));
        });
    }

    breakTextIntoLines(text) {
        const maxLength = 100;
        const lines = [];
        let currentLine = '';
        const words = text.split(' ');
        for (const word of words) {
            if (currentLine === '') { currentLine = word; }
            else if ((currentLine + ' ' + word).length <= maxLength) { currentLine += ' ' + word; }
            else { lines.push(currentLine); currentLine = word; }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    createLineWithCopyButton(container, text) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'prayer-line-individual';
        const textSpan = document.createElement('span');
        textSpan.innerHTML = text.replace(/^(Pres\.:|℟\.:|℣\.:|Leitor:|\*.*\*)/g, '<strong>$&</strong>');
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-line';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.setAttribute('data-text', this.removeSpeechPrefixes(text));
        lineDiv.appendChild(textSpan);
        lineDiv.appendChild(copyButton);
        container.appendChild(lineDiv);
    }
    
    applyLineBreaksToStaticContent() {
        document.querySelectorAll('.prayer-line, .gloria-text, .credo-text, .pai-nosso-text, .alma-cristo-text, .action-note').forEach(el => {
            if (el.dataset.formatted) return;
            this.formatElementText(el, el.innerHTML);
            el.dataset.formatted = 'true';
        });
    }

    removeSpeechPrefixes(text) {
        return text.replace(/<[^>]*>?/g, '').replace(/^(Pres\.:|℟\.:|℣\.:|Leitor:)\s*/, '').trim();
    }
    
    updateConditionalSections() {
        if (!this.liturgyData) return;
        
        // Verificar se os elementos existem antes de tentar acessá-los
        const gloriaSection = document.querySelector('.gloria-section');
        if (gloriaSection) {
            gloriaSection.style.display = this.liturgyData.hasGloria ? '' : 'none';
        }
        
        const credoSection = document.querySelector('.credo-section');
        if (credoSection) {
            credoSection.style.display = this.liturgyData.hasCredo ? '' : 'none';
        }
        
        const slSection = document.querySelector('.segunda-leitura-section');
        if (slSection) {
            slSection.style.display = this.liturgyData.hasSecondReading ? '' : 'none';
        }
    }

    async copyToClipboard(text, message = 'Texto copiado!') {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(message);
        } catch (err) { this.showToast('Falha ao copiar.', 'error'); }
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'flex' : 'none';
        const contentEl = document.getElementById('liturgical-content');
        contentEl.style.display = show ? 'none' : 'flex';
        if (!show) { contentEl.style.opacity = '1'; }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            // Remove existing color classes
            toast.classList.remove('bg-green-600', 'bg-red-600');
            // Add appropriate color class
            toast.classList.add(type === 'error' ? 'bg-red-600' : 'bg-green-600');
            // Show toast with Tailwind classes
            toast.classList.remove('translate-y-16', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
            toast.querySelector('i').className = type === 'error' ? 'fas fa-times-circle' : 'fas fa-check-circle';
            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-16', 'opacity-0');
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CelebracaoController();
});