// IndexedDB Utilities - Offline-first data storage
const DB_NAME = 'BrilliantCS';
const DB_VERSION = 1;

// Store names
const STORES = {
    users: 'users',
    subjects: 'subjects',
    tasks: 'tasks',
    classes: 'classes',
    goals: 'goals',
    pomodoro: 'pomodoro',
    syncQueue: 'syncQueue'
};

class DatabaseManager {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Users store
                if (!db.objectStoreNames.contains(STORES.users)) {
                    db.createObjectStore(STORES.users, { keyPath: 'id' });
                }

                // Subjects store
                if (!db.objectStoreNames.contains(STORES.subjects)) {
                    const subjectsStore = db.createObjectStore(STORES.subjects, { keyPath: 'id' });
                    subjectsStore.createIndex('userId', 'userId', { unique: false });
                }

                // Tasks store
                if (!db.objectStoreNames.contains(STORES.tasks)) {
                    const tasksStore = db.createObjectStore(STORES.tasks, { keyPath: 'id' });
                    tasksStore.createIndex('userId', 'userId', { unique: false });
                    tasksStore.createIndex('subjectId', 'subjectId', { unique: false });
                    tasksStore.createIndex('dueDate', 'dueDate', { unique: false });
                    tasksStore.createIndex('status', 'status', { unique: false });
                }

                // Classes store
                if (!db.objectStoreNames.contains(STORES.classes)) {
                    const classesStore = db.createObjectStore(STORES.classes, { keyPath: 'id' });
                    classesStore.createIndex('userId', 'userId', { unique: false });
                    classesStore.createIndex('subjectId', 'subjectId', { unique: false });
                    classesStore.createIndex('day', 'day', { unique: false });
                }

                // Goals store
                if (!db.objectStoreNames.contains(STORES.goals)) {
                    const goalsStore = db.createObjectStore(STORES.goals, { keyPath: 'id' });
                    goalsStore.createIndex('userId', 'userId', { unique: false });
                }

                // Pomodoro stats store
                if (!db.objectStoreNames.contains(STORES.pomodoro)) {
                    const pomodoroStore = db.createObjectStore(STORES.pomodoro, { keyPath: 'id' });
                    pomodoroStore.createIndex('userId', 'userId', { unique: false });
                    pomodoroStore.createIndex('date', 'date', { unique: false });
                }

                // Sync queue store (for pending offline changes)
                if (!db.objectStoreNames.contains(STORES.syncQueue)) {
                    const syncStore = db.createObjectStore(STORES.syncQueue, { keyPath: 'id', autoIncrement: true });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                    syncStore.createIndex('synced', 'synced', { unique: false });
                }
            };
        });
    }

    async add(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async put(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async get(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getAllByIndex(storeName, indexName, value) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);

        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async delete(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async clear(storeName) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async deleteAllByIndex(storeName, indexName, value) {
        const items = await this.getAllByIndex(storeName, indexName, value);
        for (const item of items) {
            await this.delete(storeName, item.id);
        }
    }

    // Export all data as JSON
    async exportData() {
        const data = {};
        for (const storeName of Object.values(STORES)) {
            try {
                data[storeName] = await this.getAll(storeName);
            } catch (err) {
                console.error(`Error exporting ${storeName}:`, err);
            }
        }
        return data;
    }

    // Import data from JSON
    async importData(data) {
        for (const [storeName, items] of Object.entries(data)) {
            if (STORES[Object.keys(STORES).find(key => STORES[key] === storeName)]) {
                await this.clear(storeName);
                for (const item of items) {
                    await this.put(storeName, item);
                }
            }
        }
    }

    // Clear all data
    async clearAll() {
        for (const storeName of Object.values(STORES)) {
            await this.clear(storeName);
        }
    }
}

// Global database instance
const db = new DatabaseManager();
