// Discord Integration - Arquidiocese de Belém
// Sistema de integração com Discord para a comunidade da Arquidiocese

class DiscordIntegration {
    constructor() {
        this.discordInviteUrl = 'https://discord.gg/qzzJkpYH';
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log('💜 Discord Integration initializing...');
        
        this.setupDiscordWidget();
        this.enhanceMobileExperience();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ Discord Integration initialized');
    }

    setupDiscordWidget() {
        const discordBtn = document.getElementById('discord-btn');
        if (discordBtn) {
            // Adicionar eventos de hover para efeitos visuais
            discordBtn.addEventListener('mouseenter', () => {
                this.addDiscordBtnAnimation(discordBtn);
            });
            
            discordBtn.addEventListener('mouseleave', () => {
                this.removeDiscordBtnAnimation(discordBtn);
            });
        }
    }

    addDiscordBtnAnimation(btn) {
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
    }

    removeDiscordBtnAnimation(btn) {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    enhanceMobileExperience() {
        // Melhorar experiência mobile
        const discordBtn = document.getElementById('discord-btn');
        if (discordBtn && window.innerWidth <= 768) {
            // Ajustar tamanho para mobile
            discordBtn.style.padding = '12px';
            
            // Adicionar feedback tátil
            discordBtn.addEventListener('touchstart', () => {
                this.addDiscordBtnAnimation(discordBtn);
            });
            
            discordBtn.addEventListener('touchend', () => {
                setTimeout(() => {
                    this.removeDiscordBtnAnimation(discordBtn);
                }, 200);
            });
        }
    }

    setupEventListeners() {
        // Event listener para cliques no botão Discord
        document.addEventListener('click', (e) => {
            if (e.target.closest('#discord-btn')) {
                this.trackDiscordClick();
            }
        });

        // Event listener para mudanças na orientação/tamanho da tela
        window.addEventListener('resize', () => {
            this.enhanceMobileExperience();
        });
    }

    trackDiscordClick() {
        // Analytics opcional - pode ser expandido futuramente
        console.log('🔗 Discord link clicked - Redirecting to community server');
        
        // Opcional: registrar no Firebase Analytics se disponível
        if (typeof gtag !== 'undefined') {
            gtag('event', 'discord_click', {
                event_category: 'engagement',
                event_label: 'discord_community_join'
            });
        }
    }

    // Método para abrir Discord em nova aba com confirmação opcional
    openDiscordWithConfirmation() {
        const shouldConfirm = localStorage.getItem('discord_confirm') !== 'false';
        
        if (shouldConfirm) {
            const confirmed = confirm('Você será redirecionado para o servidor Discord da Arquidiocese de Belém. Deseja continuar?');
            if (confirmed) {
                localStorage.setItem('discord_confirm', 'false'); // Não perguntar novamente
                window.open(this.discordInviteUrl, '_blank');
            }
        } else {
            window.open(this.discordInviteUrl, '_blank');
        }
    }

    // Método para verificar se o Discord está disponível
    checkDiscordAvailability() {
        // Verificar se o link do Discord ainda está válido
        fetch(this.discordInviteUrl, { method: 'HEAD', mode: 'no-cors' })
            .then(() => {
                console.log('✅ Discord server is available');
            })
            .catch(() => {
                console.warn('⚠️ Discord server may be unavailable');
            });
    }

    // Método para customizar mensagem baseada na página atual
    getContextualMessage() {
        const currentPage = window.location.pathname;
        const messages = {
            '/': 'Junte-se à nossa comunidade no Discord!',
            '/post.html': 'Discuta este post em nosso Discord!',
            '/celebracao_da_palavra.html': 'Compartilhe reflexões no Discord!',
            'default': 'Fale conosco no Discord!'
        };
        
        return messages[currentPage] || messages.default;
    }

    // Método para adicionar badge de notificação (futuro)
    addNotificationBadge(count = 1) {
        const discordBtn = document.getElementById('discord-btn');
        if (discordBtn && count > 0) {
            let badge = discordBtn.querySelector('.notification-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
                discordBtn.appendChild(badge);
            }
            badge.textContent = count > 9 ? '9+' : count;
        }
    }

    // Método para remover badge de notificação
    removeNotificationBadge() {
        const discordBtn = document.getElementById('discord-btn');
        if (discordBtn) {
            const badge = discordBtn.querySelector('.notification-badge');
            if (badge) {
                badge.remove();
            }
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.discordIntegration = new DiscordIntegration();
});

// Exportar para uso em outros módulos se necessário
export { DiscordIntegration };
