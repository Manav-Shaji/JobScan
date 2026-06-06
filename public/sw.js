/**
 * JobScan PWA Service Worker
 * Handles pre-caching, dynamic asset caching, offline page fallback, and push notifications.
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `jobscan-cache-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
  '/hero_bg.png'
];

// 1. Install Event: Pre-cache core offline shells and icons
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Cleanup outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intercept network requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (e.g. POST scans shouldn't be cached)
  if (request.method !== 'GET') {
    return;
  }

  // A. Next.js API Routes (like history lists): Network-First, fallback to Cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] API Fetch failed, returning cached version');
          return caches.match(request);
        })
    );
    return;
  }

  // B. Document/HTML Page Navigations: Network-First, fallback to Cache, then Offline Page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Navigation failed, loading cached document or offline page');
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline');
          });
        })
    );
    return;
  }

  // C. General Assets (CSS, JS, Fonts, Images): Cache-First, fallback to Network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        // Only cache valid asset files (including images in root or custom paths)
        if (response.ok && (
          url.pathname.includes('_next') || 
          url.pathname.includes('/fonts') || 
          url.pathname.includes('/images') || 
          url.pathname.includes('.css') || 
          url.pathname.includes('.js') ||
          url.pathname.match(/\.(png|jpg|jpeg|svg|webp|avif|ico|gif)$/i)
        )) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

// 4. Push Notification Event: Render native background notifications
self.addEventListener('push', (event) => {
  let payload = { title: 'JobScan Security Alert', body: 'Verify your latest dashboard scan matches safe criteria.' };
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = { title: 'JobScan Alert', body: event.data.text() };
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: payload.url || '/app?tab=overview'
    },
    actions: [
      { action: 'open_dashboard', title: 'Open Console' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// 5. Notification Click Handler: Navigate user to scan target
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/app?tab=overview';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a matching tab is already open, focus it
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
