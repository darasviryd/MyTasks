const CACHE_NAME = 'todo-pwa-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png'
];


self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => 
      Promise.all(
        STATIC_ASSETS.map(url =>
          fetch(url)
            .then(resp => {
              if (!resp.ok) throw new Error(`Fetch failed for ${url}`);
              return cache.put(url, resp);
            })
            .catch(err => {
              console.warn(err.message); 
            })
        )
      )
    )
  );
  self.skipWaiting();
});


self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) return res;
        return fetch(e.request)
          .then(resp => {
            
            if (!resp || !resp.ok) return resp;
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(e.request, resp.clone());
              return resp;
            });
          })
          .catch(() => {
            
            if (e.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});