self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/cp_en.html',
                '/cp_tc.html',
                '/app_en.js',
                '/app_tc.js',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png',
                'AdobeStock_372367644.jpeg'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});