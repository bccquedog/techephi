#!/usr/bin/env node

/**
 * Firebase Setup Verification Script
 * This script helps verify your Firebase configuration is working correctly
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔍 Firebase Configuration Verification');
console.log('=====================================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log(`API Key: ${firebaseConfig.apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`Auth Domain: ${firebaseConfig.authDomain ? '✅ Set' : '❌ Missing'}`);
console.log(`Project ID: ${firebaseConfig.projectId ? '✅ Set' : '❌ Missing'}`);
console.log(`Storage Bucket: ${firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing'}`);
console.log(`Messaging Sender ID: ${firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing'}`);
console.log(`App ID: ${firebaseConfig.appId ? '✅ Set' : '❌ Missing'}`);

// Initialize Firebase
console.log('\n🚀 Initializing Firebase...');
try {
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  console.log('✅ Firebase services initialized successfully');
  
  // Test Firestore connection
  console.log('\n📊 Testing Firestore connection...');
  try {
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful');
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.log('⚠️  Firestore accessible but permission denied (this is normal for empty collections)');
    } else if (error.code === 'unavailable') {
      console.log('❌ Firestore not available - check if database is created');
    } else {
      console.log(`❌ Firestore error: ${error.message}`);
    }
  }
  
  // Test Authentication
  console.log('\n🔐 Testing Authentication...');
  try {
    await signInAnonymously(auth);
    console.log('✅ Authentication working (anonymous sign-in successful)');
  } catch (error) {
    console.log(`❌ Authentication error: ${error.message}`);
  }
  
  console.log('\n✅ Firebase setup verification complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Go to Firebase Console and create Firestore Database');
  console.log('2. Set up Authentication (Email/Password)');
  console.log('3. Configure security rules');
  console.log('4. Test your application');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Check your Firebase configuration');
  console.log('2. Ensure the project exists in Firebase Console');
  console.log('3. Verify API key permissions');
}

console.log('\n📖 For detailed setup instructions, see: FIREBASE_PRODUCTION_SETUP.md');
