// Disclaimer Manager - Sistema centralizado para o banner de disclaimer
class DisclaimerManager {
    constructor() {
        this.disclaimerText = '⚠️ <strong>AVISO</strong>: Este é um projeto fictício para o jogo Habbo Hotel e não possui qualquer vínculo com a Arquidiocese de Belém da vida real.';
        this.init();
    }

    init() {
        console.log('🚨 Inicializando Disclaimer Manager...');
        this.createDisclaimer();
        this.addStyles();
    }

    createDisclaimer() {
        // Verificar se já existe um disclaimer
        if (document.querySelector('.disclaimer-banner')) {
            return;
        }

        // Criar o HTML do disclaimer
        const disclaimerHTML = `
            <div class="disclaimer-banner">
                <div class="disclaimer-scroll">
                    ${this.disclaimerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.disclaimerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.disclaimerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
        `;

        // Encontrar onde inserir o disclaimer (após o header)
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('afterend', disclaimerHTML);
            console.log('✅ Disclaimer inserido após o header');
        }
    }

    addStyles() {
        // Verificar se os estilos já foram adicionados
        if (document.querySelector('#disclaimer-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'disclaimer-styles';
        style.textContent = `
            .disclaimer-banner {
                background-color: #fbbf24;
                color: #000000;
                padding: 8px 0;
                font-size: 14px;
                font-weight: 500;
                overflow: hidden;
                position: relative;
                z-index: 40;
                white-space: nowrap;
            }

            .disclaimer-scroll {
                display: inline-block;
                animation: scroll-disclaimer 60s linear infinite;
                white-space: nowrap;
            }

            @keyframes scroll-disclaimer {
                0% {
                    transform: translateX(100%);
                }
                100% {
                    transform: translateX(-100%);
                }
            }

            .disclaimer-banner strong {
                font-weight: 700;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Estilos do disclaimer adicionados');
    }
}

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DisclaimerManager();
    });
} else {
    new DisclaimerManager();
}

export default DisclaimerManager;
