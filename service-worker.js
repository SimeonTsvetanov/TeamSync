self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open("teamsync-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/script.js",
        "/manifest.json",
        "/TeamSyncIcon-192.png",
        "/TeamSyncIcon-512.png",
        "/TeamSyncIcon-384.png",
        "/TeamSyncIcon-256.png",
        "/TeamSyncIcon-144.png",
        "/TeamSyncIcon-72.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
