// Push Notification Service for Web App
import { messaging, auth, db } from '../firebase.js';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

class PushNotificationService {
  constructor() {
    this.messaging = messaging;
    this.isSupported = false;
    this.token = null;
    this.onMessageCallback = null;
    this.isInitialized = false;
    this.permissionChecked = false;
  }

  // Initialize push notifications
  async initialize() {
    try {
      // Prevent multiple initializations
      if (this.isInitialized) {
        console.log('Push notifications already initialized');
        return this.isSupported;
      }

      if (!this.messaging) {
        console.warn('Firebase Messaging not available');
        return false;
      }

      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        console.warn('This browser does not support service workers');
        return false;
      }

      // Check current permission status first
      const currentPermission = Notification.permission;
      if (currentPermission === 'denied') {
        // Not an app error — user has blocked notifications at the browser level.
        // Avoid noisy console warnings in production.
        if (import.meta?.env?.DEV) {
          console.info('Notifications are blocked in browser settings (permission: denied).');
        }
        this.permissionChecked = true;
        this.isInitialized = true;
        return false;
      }

      // Request notification permission only if not already checked
      if (!this.permissionChecked) {
        const permission = await this.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission denied');
          this.permissionChecked = true;
          this.isInitialized = true;
          return false;
        }
      }

      // Get FCM token
      await this.getFCMToken();
      
      // Set up message listener
      this.setupMessageListener();
      
      // Set up service worker message listener
      this.setupServiceWorkerListener();

      this.isSupported = true;
      this.isInitialized = true;
      this.permissionChecked = true;
      console.log('✅ Push notifications initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Error initializing push notifications:', error);
      this.isInitialized = true;
      this.permissionChecked = true;
      return false;
    }
  }

  // Request notification permission
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (import.meta?.env?.DEV) {
        console.log('Notification permission:', permission);
      }
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Get FCM token
  async getFCMToken() {
    try {
      if (!this.messaging) {
        throw new Error('Firebase Messaging not initialized');
      }

      const token = await getToken(this.messaging, {
        vapidKey: 'BIVWZ68ibkYf8J6neoJO4FFWQIy4O3-c5p9k86AYFJ0M4yCWk4UCubVoNEBlU-PXu2N7CTWcm2VnJ7_QGJ6EydY'
      });

      if (token) {
        this.token = token;
        console.log('FCM Token:', token);
        
        // Save token to user profile
        await this.saveTokenToUser(token);
        
        return token;
      } else {
        console.warn('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Save FCM token to user profile
  async saveTokenToUser(token) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('No authenticated user to save token');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fcmToken: token,
        lastTokenUpdate: new Date().toISOString(),
        pushNotificationsEnabled: true
      });

      console.log('✅ FCM token saved to user profile');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  // Set up message listener for foreground messages
  setupMessageListener() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification manually for foreground messages
      this.showNotification(payload);
      
      // Call custom callback if set
      if (this.onMessageCallback) {
        this.onMessageCallback(payload);
      }
    });
  }

  // Set up service worker message listener
  setupServiceWorkerListener() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
          console.log('Notification clicked:', event.data);
          
          // Handle notification click
          this.handleNotificationClick(event.data);
        }
      });
    }
  }

  // Show notification manually (for foreground messages)
  showNotification(payload) {
    const title = payload.notification?.title || 'Tech ePhi Notification';
    const options = {
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

    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      // Fallback to browser notification
      new Notification(title, options);
    }
  }

  // Handle notification click
  handleNotificationClick(data) {
    console.log('Handling notification click:', data);
    
    // You can implement navigation logic here
    // For example, using a router or window.location
    if (data.url) {
      window.location.href = data.url;
    }
  }

  // Set callback for foreground messages
  setOnMessageCallback(callback) {
    this.onMessageCallback = callback;
  }

  // Send test notification
  async sendTestNotification() {
    try {
      if (!this.token) {
        throw new Error('No FCM token available');
      }

      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          notification: {
            title: 'Test Notification',
            body: 'This is a test notification from Tech ePhi'
          },
          data: {
            type: 'test',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        console.log('✅ Test notification sent successfully');
        return true;
      } else {
        throw new Error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  // Disable push notifications
  async disable() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        pushNotificationsEnabled: false,
        fcmToken: null
      });

      this.token = null;
      console.log('✅ Push notifications disabled');
    } catch (error) {
      console.error('Error disabling push notifications:', error);
    }
  }

  // Check if push notifications are enabled
  async isEnabled() {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.pushNotificationsEnabled === true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking push notification status:', error);
      return false;
    }
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Check if supported
  isSupported() {
    return this.isSupported;
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
