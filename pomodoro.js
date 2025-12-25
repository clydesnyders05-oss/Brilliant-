// Pomodoro Timer Module
class PomodoroManager {
    constructor() {
        this.WORK_DURATION = 25 * 60; // 25 minutes
        this.BREAK_DURATION = 5 * 60; // 5 minutes
        this.timeRemaining = this.WORK_DURATION;
        this.isRunning = false;
        this.isWorkTime = true;
        this.sessionsCompleted = 0;
        this.totalFocusTime = 0;
        this.timerInterval = null;
        this.stats = [];

        this.setupEventListeners();
        this.updateDisplay();
        this.loadStats();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        const resetBtn = document.getElementById('timer-reset');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');

        if (startBtn) startBtn.classList.add('hidden');
        if (pauseBtn) pauseBtn.classList.remove('hidden');

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();

            if (this.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.timerInterval);

        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');

        if (startBtn) startBtn.classList.remove('hidden');
        if (pauseBtn) pauseBtn.classList.add('hidden');
    }

    reset() {
        this.pause();
        this.isWorkTime = true;
        this.timeRemaining = this.WORK_DURATION;
        this.updateDisplay();
    }

    completeSession() {
        this.pause();

        if (this.isWorkTime) {
            this.sessionsCompleted++;
            this.totalFocusTime += this.WORK_DURATION;
            this.saveSession();
            this.showNotification('Great work! Time for a break.');

            this.isWorkTime = false;
            this.timeRemaining = this.BREAK_DURATION;
        } else {
            this.showNotification('Break time over. Ready for another session?');
            this.isWorkTime = true;
            this.timeRemaining = this.WORK_DURATION;
        }

        this.updateDisplay();
        this.updateStats();
    }

    updateDisplay() {
        const display = document.getElementById('timer-display');
        const modeEl = document.getElementById('timer-mode');

        if (display) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        if (modeEl) {
            modeEl.textContent = this.isWorkTime ? 'Work Focus' : 'Break Time';
        }
    }

    async saveSession() {
        try {
            const userId = auth.getCurrentUser()?.id;
            if (!userId) return;

            const session = {
                id: generateId(),
                userId,
                date: getTodayString(),
                duration: this.WORK_DURATION,
                completedAt: new Date().toISOString()
            };

            await db.add(STORES.pomodoro, session);
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    async loadStats() {
        try {
            const userId = auth.getCurrentUser()?.id;
            if (!userId) return;

            const todayString = getTodayString();
            this.stats = await db.getAllByIndex(STORES.pomodoro, 'userId', userId);

            const todayStats = this.stats.filter(s => s.date === todayString);
            this.sessionsCompleted = todayStats.length;
            this.totalFocusTime = todayStats.reduce((sum, s) => sum + s.duration, 0);

            this.updateStats();
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    updateStats() {
        const sessionsEl = document.getElementById('sessions-count');
        const totalFocusEl = document.getElementById('total-focus');

        if (sessionsEl) {
            sessionsEl.textContent = this.sessionsCompleted;
        }

        if (totalFocusEl) {
            const hours = Math.floor(this.totalFocusTime / 3600);
            const minutes = Math.floor((this.totalFocusTime % 3600) / 60);
            totalFocusEl.textContent = `${hours}h ${minutes}m`;
        }
    }

    showNotification(message) {
        // Check if browser supports notifications
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Brilliant CS', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><circle cx="50" cy="50" r="30" fill="%238b7355"/></svg>'
            });
        }

        showToast(message, 'success');
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    getFormattedTime() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Global pomodoro manager
const pomodoro = new PomodoroManager();
