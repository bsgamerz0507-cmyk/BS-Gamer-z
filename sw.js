const CACHE_NAME = "bs-gamer-z-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./contact.html",
    "./manifest.json",
    "./css/style.css",
    "./js/app.js",
    "./js/settings.js",
    "./images/logo.jpeg"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request).then(response => response || fetch(event.request))

    );

});