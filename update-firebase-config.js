#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Updating Firebase Configuration...\n');

// New Firebase configuration for techephi-crm project
const newConfig = {
  VITE_FIREBASE_API_KEY: 'AIzaSyDG1MMoN0IkYF3YJ0x4AE_a7Y6V1iQOw4M',
  VITE_FIREBASE_AUTH_DOMAIN: 'techephi-crm.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'techephi-crm',
  VITE_FIREBASE_STORAGE_BUCKET: 'techephi-crm.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '211471947782',
  VITE_FIREBASE_APP_ID: '1:211471947782:web:9bafee33af9f164e650b87'
};

// Update local .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update each environment variable
  Object.entries(newConfig).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  });
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated local .env file');
} else {
  console.log('⚠️  .env file not found, creating new one...');
  const envContent = Object.entries(newConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created new .env file');
}

console.log('\n📋 New Firebase Configuration:');
Object.entries(newConfig).forEach(([key, value]) => {
  console.log(`   ${key}=${value}`);
});

console.log('\n💡 Next steps:');
console.log('   1. Update Vercel environment variables in the dashboard');
console.log('   2. Go to https://console.firebase.google.com/project/techephi-crm/overview');
console.log('   3. Enable Authentication and Firestore in the Firebase Console');
console.log('   4. Deploy the updated application to Vercel');

console.log('\n🔗 Firebase Console URL:');
console.log('   https://console.firebase.google.com/project/techephi-crm/overview');
