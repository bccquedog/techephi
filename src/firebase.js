// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Only include measurementId if it's defined
  ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID && {
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  })
};

// Initialize Firebase with error handling
let app, auth, db, storage, analytics, messaging;

try {
  console.log('Initializing Firebase...', { 
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing'
  });
  
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Firebase services
  auth = getAuth(app);
  
  // Set persistence to LOCAL so users stay logged in across browser sessions
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('⚠️ Failed to set auth persistence:', error);
  });
  
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize Firebase Messaging (only in browser environment)
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      messaging = getMessaging(app);
      console.log('✅ Firebase Messaging initialized successfully');
    } catch (messagingError) {
      console.warn('⚠️ Firebase Messaging initialization failed:', messagingError);
      messaging = null;
    }
  }
  
  console.log('✅ Firebase services initialized successfully');
  
  // Test Firestore connection (async function to avoid top-level await)
  const testFirestoreConnection = async () => {
    try {
      const testDoc = doc(db, 'test', 'connection');
      await setDoc(testDoc, { timestamp: new Date() });
      console.log('✅ Firestore connection test successful');
      await deleteDoc(testDoc); // Clean up test document
    } catch (error) {
      console.warn('⚠️ Firestore connection test failed:', error.message);
      console.log('💡 This might be due to:');
      console.log('   1. Firestore rules blocking access');
      console.log('   2. Project not properly configured');
      console.log('   3. Network connectivity issues');
    }
  };
  
  // Temporarily disabled to prevent repeated connection errors
  // testFirestoreConnection();
  
  // Initialize Analytics (optional) - only in production or when explicitly enabled
  // Disabled temporarily due to configuration mismatch - enable after configuring in Firebase Console
  // if (typeof window !== 'undefined' && firebaseConfig.measurementId && import.meta.env.PROD) {
  //   try {
  //     analytics = getAnalytics(app);
  //     console.log('✅ Firebase Analytics initialized');
  //   } catch (analyticsError) {
  //     console.warn('⚠️ Analytics initialization failed:', analyticsError);
  //   }
  // } else if (firebaseConfig.measurementId) {
  //   console.log('📊 Analytics measurement ID available but not initializing (development mode)');
  // }
  
  // Suppress service worker warnings in development
  if (import.meta.env.DEV) {
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('Fetch event handler is recognized as no-op') ||
        message.includes('message channel closed') ||
        message.includes('service worker') ||
        message.includes('WebChannelConnection RPC') ||
        message.includes('transport errored') ||
        message.includes('asynchronous response') ||
        message.includes('message channel closed before a response')
      )) {
        // Suppress these specific warnings in development
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
    
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('service worker')
      )) {
        // Suppress these specific errors in development
        return;
      }
      originalConsoleError.apply(console, args);
    };
  }
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('💡 Production requires Firebase to be properly configured:');
  console.error('   1. Enable Authentication in Firebase Console');
  console.error('   2. Check API key restrictions in Google Cloud Console');
  console.error('   3. Verify all environment variables are set');
  
  // In production, throw error instead of creating mock objects
  throw new Error('Firebase initialization failed. Please check your Firebase configuration.');
}

// Handle service worker registration to prevent message channel issues
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {
      // Silently fail if service worker registration fails
    });
  });
}

export { auth, db, storage, analytics, messaging };
export default app;