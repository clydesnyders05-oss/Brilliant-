// Supabase Authentication Module
// Note: Replace with your actual Supabase credentials

const SUPABASE_URL = "https://zeykptypbzzkoatbtbji.supabase.co";
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpleWtwdHlwYnp6a29hdGJ0YmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Mzc0MzMsImV4cCI6MjA4MjIxMzQzM30.sBityHXudJ9PBH_JWPfnI3L0pzRsibraD5FTh6XTiGQ';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
        this.listeners = [];
        this.loadUserFromStorage();
    }

    async init() {
        await db.init();
        this.isInitialized = true;
    }

    loadUserFromStorage() {
        const user = preferences.getUser();
        if (user) {
            this.currentUser = user;
        }
    }

    async signUp(email, password, name) {
        try {
            // Simulate Supabase sign up
            const userId = generateId();
            const user = {
                id: userId,
                email,
                name,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            // Store user in IndexedDB
            await db.put(STORES.users, user);

            // Save to localStorage
            preferences.setUser(user);
            preferences.setLastLogin(user.lastLogin);

            this.currentUser = user;
            this.notifyListeners(user);

            showToast(`Welcome ${name}!`, 'success');
            return { user, error: null };
        } catch (error) {
            showToast('Sign up failed. Please try again.', 'error');
            return { user: null, error };
        }
    }

    async signIn(email, password) {
        try {
            // Simulate Supabase sign in
            // In production, this would call Supabase API
            const users = await db.getAll(STORES.users);
            const user = users.find(u => u.email === email);

            if (!user) {
                showToast('Email not found. Please sign up.', 'error');
                return { user: null, error: 'User not found' };
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            await db.put(STORES.users, user);

            preferences.setUser(user);
            preferences.setLastLogin(user.lastLogin);

            this.currentUser = user;
            this.notifyListeners(user);

            showToast(`Welcome back, ${user.name}!`, 'success');
            return { user, error: null };
        } catch (error) {
            showToast('Sign in failed. Please try again.', 'error');
            return { user: null, error };
        }
    }

    async signOut() {
        try {
            preferences.setUser(null);
            this.currentUser = null;
            this.notifyListeners(null);
            showToast('Signed out successfully', 'success');
            return { error: null };
        } catch (error) {
            showToast('Sign out failed', 'error');
            return { error };
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners(user) {
        this.listeners.forEach(callback => callback(user));
    }

    // In production, implement real Supabase API calls
    async makeAuthRequest(endpoint, options) {
        try {
            const response = await fetch(`${SUPABASE_URL}/auth/v1${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`Auth request failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Auth request error:', error);
            throw error;
        }
    }
}

// Global auth manager
const auth = new AuthManager();
