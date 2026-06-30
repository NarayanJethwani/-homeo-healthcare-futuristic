self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and HTTP/HTTPS protocol
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Pass-through fetch handler to satisfy PWA installability requirements
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Offline");
    })
  );
});

