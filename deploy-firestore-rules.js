#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const _path = require('path');

console.log('🚀 Deploying Firestore Rules to Firebase...\n');

// Check if firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
} catch {
  console.error('❌ Firebase CLI is not installed. Please install it first:');
  console.error('   npm install -g firebase-tools');
  console.error('   Then run: firebase login');
  process.exit(1);
}

// Check if firebase.json exists
if (!fs.existsSync('firebase.json')) {
  console.error('❌ firebase.json not found. Please create it first.');
  process.exit(1);
}

// Check if firestore.rules exists
if (!fs.existsSync('firestore.rules')) {
  console.error('❌ firestore.rules not found. Please create it first.');
  process.exit(1);
}

try {
  console.log('📋 Deploying Firestore rules...');
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  
  console.log('\n📋 Deploying Firestore indexes...');
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  
  console.log('\n✅ Firestore rules and indexes deployed successfully!');
  console.log('\n💡 Your Firestore database is now properly configured with security rules.');
  console.log('   Users can now read/write data according to their roles and permissions.');
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.error('\n💡 Make sure you are logged into Firebase:');
  console.error('   firebase login');
  console.error('\n💡 And that you have selected the correct project:');
  console.error('   firebase use <your-project-id>');
  process.exit(1);
}


