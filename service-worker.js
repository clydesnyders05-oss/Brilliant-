// Service Worker - Offline Support and Caching Strategy
const CACHE_VERSION = 'v1';
const CACHE_NAME = `brilliant-cs-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/reset.css',
    '/css/theme.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/js/utils/db.js',
    '/js/utils/offline.js',
    '/js/utils/quotes.js',
    '/js/modules/auth.js',
    '/js/modules/ui.js',
    '/js/modules/subjects.js',
    '/js/modules/tasks.js',
    '/js/modules/timetable.js',
    '/js/modules/pomodoro.js',
    '/js/modules/calendar.js',
    '/js/modules/vision.js',
    '/js/modules/settings.js',
    '/js/app.js'
];

// Install Event - Cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching assets');
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('[Service Worker] Error caching some assets:', err);
                // Don't fail the install if some assets can't be cached
                return Promise.resolve();
            });
        }).then(() => {
            self.skipWaiting();
        })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: 'CACHE_UPDATED' });
                });
            });
        })
    );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Use cache first strategy for assets
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request).then((response) => {
                // Serve from cache if available
                if (response) {
                    // Try to update cache in background
                    fetch(request).then((fetchResponse) => {
                        if (fetchResponse && fetchResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, fetchResponse);
                            });
                        }
                    }).catch(() => {
                        // Network error, that's okay - we have the cached version
                    });

                    return response;
                }

                // Not in cache, try network
                return fetch(request).then((response) => {
                    // Cache successful responses
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }

                    return response;
                }).catch(() => {
                    // Network error and not in cache
                    // Return offline page or appropriate response
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }

                    // Return a generic offline response
                    return new Response('Offline - Resource not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
        );
    }
});

// Background Sync - Sync data when online
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            syncOfflineData()
        );
    }
});

async function syncOfflineData() {
    console.log('[Service Worker] Syncing offline data...');
    // This would sync any pending changes from IndexedDB
    // In production, implement full sync logic here
}

// Push Notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Brilliant CS Notification',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%238b7355" width="100" height="100"/><circle cx="50" cy="50" r="30" fill="%23f5f5f5"/></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%238b7355"/></svg>',
        vibrate: [200, 100, 200],
        tag: 'brilliant-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification('Brilliant CS', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if the app is already open
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not open, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Message Handler - Communication with clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] Service Worker Loaded');
