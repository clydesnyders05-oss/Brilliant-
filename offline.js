// Offline and Sync Utilities
class OfflineManager {
    constructor() {
        this.online = navigator.onLine;
        this.listeners = [];

        window.addEventListener('online', () => this.setOnline(true));
        window.addEventListener('offline', () => this.setOnline(false));
    }

    setOnline(online) {
        if (this.online !== online) {
            this.online = online;
            this.notifyListeners();

            if (online) {
                console.log('App is now online');
                this.syncOfflineChanges();
            } else {
                console.log('App is now offline');
            }
        }
    }

    isOnline() {
        return this.online;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.online));
    }

    async syncOfflineChanges() {
        try {
            const syncQueue = await db.getAll(STORES.syncQueue);
            const unsynced = syncQueue.filter(item => !item.synced);

            for (const item of unsynced) {
                // Sync logic would go here
                // For now, just mark as synced
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                await db.put(STORES.syncQueue, item);
            }
        } catch (err) {
            console.error('Error syncing offline changes:', err);
        }
    }

    async queueChange(action, storeName, data) {
        try {
            await db.add(STORES.syncQueue, {
                action,
                storeName,
                data,
                timestamp: new Date().toISOString(),
                synced: false
            });
        } catch (err) {
            console.error('Error queuing change:', err);
        }
    }
}

// Global offline manager
const offline = new OfflineManager();

// LocalStorage for preferences (light/dark theme, etc)
class PreferencesManager {
    constructor() {
        this.prefix = 'brilliant_';
        this.loadPreferences();
    }

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (err) {
            console.error('Error saving preference:', err);
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (err) {
            console.error('Error reading preference:', err);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (err) {
            console.error('Error removing preference:', err);
        }
    }

    loadPreferences() {
        // Load theme preference
        const theme = this.get('theme', 'light');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    setTheme(theme) {
        this.set('theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    getTheme() {
        return this.get('theme', 'light');
    }

    setUser(user) {
        this.set('currentUser', user);
    }

    getUser() {
        return this.get('currentUser');
    }

    setLastLogin(timestamp) {
        this.set('lastLogin', timestamp);
    }

    getLastLogin() {
        return this.get('lastLogin');
    }
}

// Global preferences manager
const preferences = new PreferencesManager();

// Notification utilities
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;

    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// UUID Generator
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Date utilities
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function formatTime(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get today's date in YYYY-MM-DD format
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Get the day of week name
function getDayName(dayString) {
    const days = {
        'monday': 'Monday',
        'tuesday': 'Tuesday',
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday'
    };
    return days[dayString] || dayString;
}

// Check if a date is today
function isToday(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const today = new Date();
    return date.toDateString() === today.toDateString();
}
