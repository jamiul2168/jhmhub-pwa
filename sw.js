// Service Worker for JH Movie Hub

const CACHE_NAME = 'jh-movie-hub-v2'; // নতুন কোনো পরিবর্তন আনলে ভার্সন পরিবর্তন করুন (e.g., v3, v4)

// অফলাইনে দেখানোর জন্য যে পেজগুলো ক্যাশে রাখতে চান
const urlsToCache = [
  '/',
  // '/p/offline.html' // (ঐচ্ছিক) একটি অফলাইন পেজ তৈরি করে তার লিংক দিন
];

// ধাপ ১: সার্ভিস ওয়ার্কার ইনস্টল এবং ক্যাশিং
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ধাপ ২: নেটওয়ার্ক রিকোয়েস্ট নিয়ন্ত্রণ করা (ক্যাশে থাকলে দেখানো)
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
      // (ঐচ্ছিক) ইন্টারনেট ও ক্যাশ, দুটিই ব্যর্থ হলে অফলাইন পেজটি দেখানো হবে
      // .catch(() => {
      //   return caches.match('/p/offline.html');
      // })
  );
});

// ধাপ ৩: Push Notification গ্রহণ করা
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    image: data.image, // নোটিফিকেশনে বড় ছবি দেখানোর জন্য
    badge: 'https://i.ibb.co/zVBLf1n3/5aa0ef32-4022-4581-9b46-9f01ebb2e616-1.jpg', // ছোট একটি আইকন (ঐচ্ছিক)
    data: {
      url: data.data.url
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ধাপ ৪: Notification-এ ক্লিক করলে নির্দিষ্ট লিংকে নিয়ে যাওয়া
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
