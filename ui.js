// UI Management Module - Navigation, modals, screens
class UIManager {
    constructor() {
        this.currentView = 'dashboard';
        this.setupEventListeners();
        this.setupModals();
        this.updateStatusBar();
    }

    setupEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.switchView(e));
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                menuToggle.classList.toggle('active');
            });
        }

        // Settings toggle
        const settingsToggle = document.getElementById('settings-toggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', () => {
                this.switchView({ target: { dataset: { view: 'settings' } } });
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const currentTheme = preferences.getTheme();
            themeToggle.checked = currentTheme === 'dark';
            themeToggle.addEventListener('change', () => {
                const newTheme = themeToggle.checked ? 'dark' : 'light';
                preferences.setTheme(newTheme);
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
                this.showScreen('auth-screen');
            });
        }

        // Close sidebaron link click (mobile)
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                if (menuToggle) menuToggle.classList.remove('active');
            });
        });
    }

    setupModals() {
        // Modal close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Close modal when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    switchView(event) {
        event.preventDefault();
        const target = event.target;
        const viewName = target.dataset.view;

        if (viewName) {
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            target.classList.add('active');

            // Update active view
            this.showView(viewName);
            this.currentView = viewName;
        }
    }

    showView(viewName) {
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });

        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.add('active');
        }
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    }

    showMainApp() {
        const authScreen = document.getElementById('auth-screen');
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainApp = document.getElementById('main-app');

        if (authScreen) authScreen.classList.add('hidden');
        if (welcomeScreen) welcomeScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
    }

    showWelcome() {
        this.showScreen('welcome-screen');
    }

    showAuthScreen() {
        this.showScreen('auth-screen');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Focus first input
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            // Reset form if it exists
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => this.closeModal(modal));
    }

    updateUserDisplay() {
        const user = auth.getCurrentUser();
        if (user) {
            const userNameEl = document.getElementById('user-name');
            if (userNameEl) {
                userNameEl.textContent = user.name;
            }
        }
    }

    updateStatusBar() {
        offline.subscribe((isOnline) => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                const userStatus = sidebar.querySelector('.user-status');
                if (userStatus) {
                    userStatus.textContent = isOnline ? 'Online' : 'Offline';
                }
            }
        });
    }

    updateDate() {
        const dateEl = document.getElementById('today-date');
        if (dateEl) {
            const today = new Date();
            dateEl.textContent = today.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    setViewLoading(loading = true) {
        const mainApp = document.getElementById('main-app');
        if (loading) {
            mainApp.classList.add('loading');
        } else {
            mainApp.classList.remove('loading');
        }
    }
}

// Global UI manager
const ui = new UIManager();
