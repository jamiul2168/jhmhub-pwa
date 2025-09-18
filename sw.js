const CACHE_NAME = 'jh-movie-hub-v1';
// অফলাইনে দেখানোর জন্য যে পেজগুলো ক্যাশে রাখতে চান
const urlsToCache = [
  '/',
  '/p/offline.html' // একটি অফলাইন পেজ তৈরি করে তার লিংক দিন
];

// সার্ভিস ওয়ার্কার ইনস্টল করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// নেটওয়ার্ক রিকোয়েস্ট নিয়ন্ত্রণ করা
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশে পেলে সেখান থেকে দেখানো হবে
        if (response) {
          return response;
        }
        // ক্যাশে না পেলে ইন্টারনেট থেকে লোড করা হবে
        return fetch(event.request);
      })
      .catch(() => {
        // ইন্টারনেট ও ক্যাশ, দুটিই ব্যর্থ হলে অফলাইন পেজটি দেখানো হবে
        return caches.match('/p/offline.html');
      })
  );
});