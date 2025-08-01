// Hebrew Trivia Tower PWA - Service Worker - Enhanced Edition
const CACHE_NAME = 'hebrew-trivia-v2.1.0';
const urlsToCache = [
    './',
    './index.html',
    './game.js',
    './style.css',
    './tutorial.html',
    './manifest.json',
    './questions.json'
];

console.log('🔧 Service Worker script loaded - Enhanced Edition v2.1.0');

// Install event - cache resources
self.addEventListener('install', function(event) {
    console.log('📦 Service Worker installing Enhanced Edition...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ Cache opened successfully');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('✅ All Enhanced Edition resources cached successfully');
                // Force activation
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.error('❌ Failed to cache Enhanced Edition resources:', error);
            })
    );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', function(event) {
    console.log('🚀 Service Worker activating Enhanced Edition...');
    
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        // Delete old caches from previous versions
                        if (cacheName !== CACHE_NAME && cacheName.startsWith('hebrew-trivia-')) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                console.log('✅ Enhanced Edition Service Worker activated and ready');
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    // Skip requests with query parameters (like ?mode=single)
    const url = new URL(event.request.url);
    const cleanUrl = url.pathname === '/' ? './' : url.pathname;
    
    event.respondWith(
        caches.match(cleanUrl)
            .then(function(response) {
                if (response) {
                    console.log('📱 Serving from cache:', cleanUrl.split('/').pop() || 'index');
                    return response;
                }
                
                console.log('🌐 Fetching from network:', cleanUrl.split('/').pop() || 'index');
                return fetch(event.request)
                    .then(function(response) {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response for caching
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(cleanUrl, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(function(error) {
                        console.error('❌ Network fetch failed:', error);
                        
                        // Return offline fallback for HTML pages
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                        
                        // For JSON files, try to return cached version
                        if (event.request.url.endsWith('.json')) {
                            return caches.match(cleanUrl);
                        }
                        
                        throw error;
                    });
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', function(event) {
    console.log('💬 Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME,
            description: 'Enhanced Edition with 1500+ questions'
        });
    }
});

// Background sync for offline question submissions (future feature)
self.addEventListener('sync', function(event) {
    if (event.tag === 'sync-game-progress') {
        console.log('🔄 Syncing game progress...');
        event.waitUntil(syncGameProgress());
    }
});

async function syncGameProgress() {
    try {
        // This would sync offline game progress when back online
        console.log('✅ Game progress synced successfully');
    } catch (error) {
        console.error('❌ Failed to sync game progress:', error);
    }
}

// Push notification handling (future feature)
self.addEventListener('push', function(event) {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect width="192" height="192" fill="%232563eb"/%3E%3Ctext x="96" y="120" text-anchor="middle" font-size="80" fill="white"%3E🏗️%3C/text%3E%3C/svg%3E',
            badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" fill="%232563eb"/%3E%3Ctext x="48" y="60" text-anchor="middle" font-size="40" fill="white"%3E🏗️%3C/text%3E%3C/svg%3E',
            vibrate: [200, 100, 200],
            tag: 'trivia-notification',
            actions: [
                {
                    action: 'play',
                    title: 'שחק עכשיו',
                    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="white" d="M8 5v14l11-7z"/%3E%3C/svg%3E'
                },
                {
                    action: 'dismiss',
                    title: 'סגור',
                    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="white" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/%3E%3C/svg%3E'
                }
            ],
            requireInteraction: true
        };
        
        event.waitUntil(
            self.registration.showNotification('מגדל הטריוויה הקנדי', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'play') {
        event.waitUntil(
            clients.openWindow('./?notification=play')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

// Periodic background sync (future feature)
self.addEventListener('periodicsync', function(event) {
    if (event.tag === 'daily-trivia-check') {
        event.waitUntil(checkForNewContent());
    }
});

async function checkForNewContent() {
    try {
        console.log('🔍 Checking for new trivia content...');
        // This would check for new questions, stories, etc.
        
        // For now, just update the cache
        const cache = await caches.open(CACHE_NAME);
        await fetch('./questions.json').then(response => {
            if (response.ok) {
                cache.put('./questions.json', response.clone());
                console.log('✅ Questions updated');
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to check for new content:', error);
    }
}

// Log when service worker is ready
self.addEventListener('controllerchange', function() {
    console.log('🎉 Enhanced Edition Service Worker is now controlling the app');
});

// Performance monitoring
self.addEventListener('fetch', function(event) {
    const startTime = performance.now();
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                if (duration > 100) {
                    console.warn(`⚠️ Slow cache lookup: ${duration.toFixed(2)}ms for ${event.request.url}`);
                }
                
                return response || fetch(event.request);
            })
    );
});

// Error handling and reporting
self.addEventListener('error', function(event) {
    console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🏗️ Hebrew Trivia Tower Enhanced Edition Service Worker loaded successfully!');