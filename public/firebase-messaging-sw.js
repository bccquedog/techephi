// Firebase Messaging Service Worker
// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjHLhECxsAW8DWN63tTVZSCExpT33tFUg",
  authDomain: "lifeline-37sh6.firebaseapp.com",
  projectId: "lifeline-37sh6",
  storageBucket: "lifeline-37sh6.firebasestorage.app",
  messagingSenderId: "24849207864",
  appId: "1:24849207864:web:ddfeef6f0efa16135c0ccd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Tech ePhi Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: payload.data?.type || 'default',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/logo.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const data = event.notification.data;
  const action = event.action;
  
  if (action === 'dismiss') {
    return;
  }
  
  // Handle different notification types
  let url = '/';
  if (data) {
    switch (data.type) {
      case 'chat':
        url = `/messages?conversation=${data.conversationId}`;
        break;
      case 'job':
        url = `/jobs/${data.jobId}`;
        break;
      case 'invoice':
        url = `/invoices/${data.invoiceId}`;
        break;
      case 'system':
        url = '/notifications';
        break;
      default:
        url = '/dashboard';
    }
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            data: data,
            url: url
          });
          return;
        }
      }
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification dismissal
  if (event.notification.data) {
    // You can send analytics data here
    console.log('Notification dismissed:', event.notification.data);
  }
});

// Service worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('Firebase messaging service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Firebase messaging service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle fetch events
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});


