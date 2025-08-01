// Hebrew Trivia Tower PWA - Service Worker
const CACHE_NAME = 'hebrew-trivia-v2.0.1';
const urlsToCache = [
    './',
    './index.html',
    './game.js',
    './style.css',
    './tutorial.html',
    './manifest.json'
];

console.log('🔧 Service Worker script loaded');

// Install event - cache resources
self.addEventListener('install', function(event) {
    console.log('📦 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ Cache opened successfully');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('✅ All resources cached successfully');
                // Force activation
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.error('❌ Failed to cache resources:', error);
            })
    );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', function(event) {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                console.log('✅ Service Worker activated and ready');
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
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    console.log('📱 Serving from cache:', event.request.url.split('/').pop());
                    return response;
                }
                
                console.log('🌐 Fetching from network:', event.request.url.split('/').pop());
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
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(function(error) {
                        console.error('❌ Network fetch failed:', error);
                        
                        // Return offline fallback for HTML pages
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
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
});

// Log when service worker is ready
self.addEventListener('controllerchange', function() {
    console.log('🎉 Service Worker is now controlling the app');
});
