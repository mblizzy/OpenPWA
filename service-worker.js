let cacheName = "OpenGithubPWA";

let filesToCache = [
  "https://pranoysarkar.github.io/OpenPWA/",
  "service-worker.js",
  "/OpenPWA",
  "js/main.js",
  "js/install-handler.js",
  "js/settings.js",
  "css/main.css",
  "assets/icons/icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "manifest.json"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    console.log('installed successfully')
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function (event) {

  if (event.request.url.includes('clean-cache')) {
    caches.delete(cacheName);
    console.log('Cache cleared')
  }

  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      console.log('served form cache')
    } else {
      console.log('Not serving from cache ', event.request.url)
    }
    return response || fetch(event.request);
  })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
