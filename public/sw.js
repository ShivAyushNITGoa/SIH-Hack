// Service Worker for Civic Issues Management PWA
// Provides offline functionality and caching

const CACHE_NAME = 'civic-issues-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/issues',
  '/map',
  '/analytics',
  '/comments',
  '/settings',
  '/manifest.json',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/issues/,
  /\/api\/analytics/,
  /\/api\/departments/,
  /\/api\/comments/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticFile(request)) {
    event.respondWith(handleStaticFile(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Check if request is for a static file
function isStaticFile(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

// Check if request is for API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is for a page
function isPageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/dashboard') ||
         url.pathname.startsWith('/issues') ||
         url.pathname.startsWith('/map') ||
         url.pathname.startsWith('/analytics') ||
         url.pathname.startsWith('/comments') ||
         url.pathname.startsWith('/settings') ||
         url.pathname === '/';
}

// Handle static files (cache first)
function handleStaticFile(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return offline fallback for images
          if (request.destination === 'image') {
            return new Response('', { status: 404 });
          }
        });
    });
}

// Handle API requests (network first, cache fallback)
function handleAPIRequest(request) {
  return fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          // Return empty data structure for offline
          return new Response(JSON.stringify({
            data: [],
            error: 'Offline - data not available',
            offline: true
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
    });
}

// Handle page requests (network first, cache fallback)
function handlePageRequest(request) {
  return fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          // Return offline page
          return caches.match('/offline.html')
            .then((offlineResponse) => {
              return offlineResponse || new Response('Offline', { status: 503 });
            });
        });
    });
}

// Handle other requests (cache first)
function handleOtherRequest(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        });
    });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'issue-sync') {
    event.waitUntil(syncOfflineIssues());
  } else if (event.tag === 'comment-sync') {
    event.waitUntil(syncOfflineComments());
  }
});

// Sync offline issues when connection is restored
async function syncOfflineIssues() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const issueRequests = requests.filter(req => 
      req.url.includes('/api/issues') && req.method === 'POST'
    );
    
    for (const request of issueRequests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Synced offline issue:', request.url);
        }
      } catch (error) {
        console.error('Failed to sync issue:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync offline comments when connection is restored
async function syncOfflineComments() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const commentRequests = requests.filter(req => 
      req.url.includes('/api/comments') && req.method === 'POST'
    );
    
    for (const request of commentRequests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Synced offline comment:', request.url);
        }
      } catch (error) {
        console.error('Failed to sync comment:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Civic Issues Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open dashboard
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_ISSUES') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});
