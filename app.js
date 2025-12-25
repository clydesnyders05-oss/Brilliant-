// Main App Controller - Initialization and Authentication Flow
class BrilliantCS {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Brilliant CS...');

            // Initialize database
            await db.init();
            console.log('✓ Database initialized');

            // Register service worker for PWA
            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register('service-worker.js');
                    console.log('✓ Service Worker registered');
                } catch (err) {
                    console.warn('Service Worker registration failed:', err);
                }
            }

            // Initialize auth
            await auth.init();

            // Setup authentication flow
            this.setupAuthFlow();

            // Subscribe to offline changes
            offline.subscribe((isOnline) => {
                console.log(isOnline ? '🟢 Online' : '🔴 Offline');
            });

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                pomodoro.requestNotificationPermission();
            }

            this.initialized = true;
            console.log('✓ Brilliant CS initialized');
        } catch (error) {
            console.error('Initialization error:', error);
            showToast('Failed to initialize app', 'error');
        }
    }

    setupAuthFlow() {
        // Check if user is already logged in
        const currentUser = auth.getCurrentUser();

        if (currentUser) {
            // User is logged in, show main app
            this.showMainApp(currentUser);
        } else {
            // User is not logged in, show auth screen
            this.showAuthScreen();
        }

        // Listen for auth changes
        auth.subscribe((user) => {
            if (user) {
                this.showMainApp(user);
            } else {
                this.showAuthScreen();
            }
        });
    }

    showAuthScreen() {
        ui.showAuthScreen();
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        // Sign in form
        const signinForm = document.querySelector('#signin-form form');
        if (signinForm) {
            signinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('signin-email').value;
                const password = document.getElementById('signin-password').value;

                ui.setViewLoading(true);
                const { user, error } = await auth.signIn(email, password);
                ui.setViewLoading(false);

                if (!error) {
                    // Switch to main app
                    this.showMainApp(user);
                }
            });
        }

        // Sign up form
        const signupForm = document.querySelector('#signup-form form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirm = document.getElementById('signup-confirm').value;

                if (password !== confirm) {
                    showToast('Passwords do not match', 'error');
                    return;
                }

                if (password.length < 6) {
                    showToast('Password must be at least 6 characters', 'error');
                    return;
                }

                ui.setViewLoading(true);
                const { user, error } = await auth.signUp(email, password, name);
                ui.setViewLoading(false);

                if (!error) {
                    // Show welcome screen
                    this.showWelcome();
                }
            });
        }

        // Form toggle
        const toggleButtons = document.querySelectorAll('.form-toggle .link-btn');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const signinForm = document.getElementById('signin-form');
                const signupForm = document.getElementById('signup-form');

                signinForm.classList.toggle('active');
                signupForm.classList.toggle('active');
            });
        });
    }

    showWelcome() {
        ui.showWelcome();
        const welcomeBtn = document.getElementById('welcome-btn');
        if (welcomeBtn) {
            welcomeBtn.addEventListener('click', () => {
                this.showMainApp(auth.getCurrentUser());
            });
        }
    }

    showMainApp(user) {
        ui.showMainApp();
        ui.updateUserDisplay();
        ui.updateDate();

        // Load all data
        this.loadAllData();

        // Set up auto-refresh for quotes
        this.setupQuoteRefresh();
    }

    async loadAllData() {
        try {
            // Load all data in parallel
            await Promise.all([
                subjects.loadSubjects(),
                tasks.loadTasks(),
                timetable.loadClasses(),
                calendar.loadCalendar(),
                vision.loadGoals(),
                pomodoro.loadStats()
            ]);

            // Render dependent data
            tasks.renderTodayTasks();
            timetable.renderTimetablePreview();
            calendar.updateTaskCounts();

            // Update dashboard quote
            this.refreshQuote();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupQuoteRefresh() {
        const refreshBtn = document.getElementById('refresh-quote');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshQuote());
        }
    }

    refreshQuote() {
        const quote = quoteManager.loadRandomQuote();
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');

        if (quoteText) quoteText.textContent = `"${quote.text}"`;
        if (quoteAuthor) quoteAuthor.textContent = `— ${quote.author}`;
    }
}

// Initialize app when DOM is ready
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new BrilliantCS();
    });
} else {
    app = new BrilliantCS();
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
