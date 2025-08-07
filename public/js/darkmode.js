document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Manager para Arquidiocese de Belém do Pará

    class DarkModeManager {
        constructor() {
            this.darkModeKey = 'arquidiocese-dark-mode';
            this.button = null;
            this.currentTheme = this.getStoredTheme() || 'light';
            
            this.init();
        }
        
        init() {
            this.findToggleButton();
            this.applyTheme(this.currentTheme);
            this.setupEventListeners();
            
            console.log('🌙 Dark Mode inicializado para a Arquidiocese');
        }
        
        findToggleButton() {
            // Procura pelo botão existente no header
            this.button = document.getElementById('dark-mode-toggle');
            
            if (!this.button) {
                // Se não encontrar, cria um novo (fallback)
                this.button = document.createElement('button');
                this.button.id = 'dark-mode-toggle';
                this.button.className = 'p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200';
                this.button.setAttribute('title', 'Alternar modo escuro');
                document.body.appendChild(this.button);
            }
            
            // Atualiza o conteúdo do botão
            this.updateButtonContent();
        }
        
        updateButtonContent() {
            if (this.button) {
                this.button.innerHTML = `<i class="fas fa-${this.currentTheme === 'dark' ? 'sun' : 'moon'} text-lg"></i>`;
            }
        }
        
        setupEventListeners() {
            this.button.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // Detectar preferência do sistema
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaQuery.addEventListener('change', (e) => {
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
            
            // Atalho de teclado (Ctrl/Cmd + Shift + D)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
        
        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
            this.storeTheme(newTheme);
            
            // Animação no botão
            this.button.classList.add('rotating');
            setTimeout(() => {
                this.button.classList.remove('rotating');
            }, 300);
            
            // Feedback para screen readers
            this.announceThemeChange(newTheme);
        }
        
        applyTheme(theme) {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            
            // Adicionar/remover classe 'dark' para Tailwind CSS
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            // Atualizar ícone do botão
            this.updateButtonContent();
            
            // Atualizar aria-label
            if (this.button) {
                this.button.setAttribute('aria-label', 
                    theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'
                );
                
                this.button.setAttribute('title', 
                    theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'
                );
            }            // Atualizar meta theme-color para mobile
            this.updateThemeColor(theme);
        }
        
        updateThemeColor(theme) {
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            
            metaThemeColor.content = theme === 'dark' ? '#2d2d2d' : '#ffffff';
        }
        
        storeTheme(theme) {
            try {
                localStorage.setItem(this.darkModeKey, theme);
            } catch (e) {
                console.warn('Não foi possível salvar preferência de tema:', e);
            }
        }
        
        getStoredTheme() {
            try {
                return localStorage.getItem(this.darkModeKey);
            } catch (e) {
                console.warn('Não foi possível recuperar preferência de tema:', e);
                return null;
            }
        }
        
        announceThemeChange(theme) {
            // Criar anúncio para screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Modo ${theme === 'dark' ? 'escuro' : 'claro'} ativado`;
            
            document.body.appendChild(announcement);
            
            // Remover após anúncio
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
        
        // Método público para outros scripts
        getCurrentTheme() {
            return this.currentTheme;
        }
        
        // Método público para forçar um tema
        setTheme(theme) {
            if (theme === 'light' || theme === 'dark') {
                this.applyTheme(theme);
                this.storeTheme(theme);
            }
        }
    }

    // Inicializar o Dark Mode Manager
    window.darkModeManager = new DarkModeManager();

    // Exportar para uso em outros módulos se necessário
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DarkModeManager;
    }
});
