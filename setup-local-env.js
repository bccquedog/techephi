#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `VITE_FIREBASE_API_KEY=AIzaSyDG1MMoN0IkYF3YJ0x4AE_a7Y6V1iQOw4M
VITE_FIREBASE_AUTH_DOMAIN=techephi-crm.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techephi-crm
VITE_FIREBASE_STORAGE_BUCKET=techephi-crm.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=211471947782
VITE_FIREBASE_APP_ID=1:211471947782:web:9bafee33af9f164e650b87
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_USE_REAL_FIREBASE=true
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Local .env file created successfully!');
  console.log('📁 File location:', envPath);
  console.log('\n🔄 Please restart your development server to pick up the new environment variables.');
  console.log('   Run: npm run dev');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please manually create a .env file in the project root with the following content:');
  console.log('\n' + envContent);
}


