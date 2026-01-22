// Firebase Admin SDK initialization
// This file initializes Firebase Admin SDK for server-side operations
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let adminApp;

try {
  // Check if Firebase Admin is already initialized
  if (admin.apps.length === 0) {
    // Get credentials from environment variables
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    // Parse the service account key (can be JSON string or object)
    let credentials;
    try {
      credentials = typeof serviceAccount === 'string' 
        ? JSON.parse(serviceAccount) 
        : serviceAccount;
    } catch (error) {
      throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. It should be a valid JSON string.');
    }

    // Initialize Firebase Admin
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(credentials),
      projectId: credentials.project_id || process.env.FIREBASE_PROJECT_ID || 'lifeline-37sh6',
    });

    console.log('Firebase Admin SDK initialized successfully');
  } else {
    adminApp = admin.app();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  throw error;
}

// Export Firebase Admin services
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export const adminMessaging = admin.messaging();
export const adminStorage = admin.storage();

export default adminApp;
