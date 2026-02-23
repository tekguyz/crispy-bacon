self.addEventListener('fetch', (event) => {
  // Basic fetch listener to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});
