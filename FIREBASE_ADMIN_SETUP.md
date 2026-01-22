# Firebase Admin SDK Setup Guide

## Overview
Firebase Admin SDK is used for server-side operations that require elevated privileges, such as:
- Sending push notifications
- Managing user accounts
- Performing administrative operations
- Bypassing Firestore security rules (when necessary)

## Environment Variables

Add the following to your `.env.local` file:

```bash
# Firebase Admin SDK Service Account Key (JSON string)
# IMPORTANT: Replace with your actual service account JSON
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"lifeline-37sh6","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@lifeline-37sh6.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Optional: Firebase Project ID (if not in service account key)
FIREBASE_PROJECT_ID=lifeline-37sh6
```

**Note:** The JSON string should be on a single line or properly escaped. Make sure to include the entire JSON object from the downloaded service account key file.

## Getting the Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`lifeline-37sh6`)
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Copy the entire JSON content and add it to `.env.local` as `FIREBASE_SERVICE_ACCOUNT_KEY`

**Important:** 
- Keep this key secure and never commit it to version control
- The `.env.local` file is already in `.gitignore`
- For production, add this as an environment variable in Vercel

## Usage in API Routes

The Firebase Admin SDK is initialized in `api/firebase-admin.js` and can be imported in your API routes:

```javascript
import { adminAuth, adminFirestore, adminMessaging } from './firebase-admin.js';

// Example: Get user by email
const userSnapshot = await adminFirestore.collection('users')
  .where('email', '==', 'user@example.com')
  .get();

// Example: Send push notification
await adminMessaging.send({
  token: fcmToken,
  notification: {
    title: 'Hello',
    body: 'World'
  }
});

// Example: Get user by UID
const userRecord = await adminAuth.getUser(userId);
```

## Updated Files

- ✅ `api/firebase-admin.js` - Firebase Admin SDK initialization
- ✅ `api/send-notification.js` - Updated to use Admin SDK
- ✅ `package.json` - Added `firebase-admin` dependency

## Vercel Deployment

When deploying to Vercel, add the environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `FIREBASE_SERVICE_ACCOUNT_KEY` with the JSON string value
3. Make sure it's available for **Production**, **Preview**, and **Development** environments

## Security Notes

- ✅ Service account keys have full access to your Firebase project
- ✅ Never expose these keys in client-side code
- ✅ Only use in server-side API routes
- ✅ Rotate keys if compromised
- ✅ Use least privilege principle - only grant necessary permissions

## Troubleshooting

### Error: "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set"
- Make sure `.env.local` exists and contains the key
- Restart your development server after adding the variable
- For production, verify the variable is set in Vercel

### Error: "Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY"
- Ensure the JSON is valid
- Make sure the entire JSON is on one line or properly escaped
- Check for special characters that need escaping

### Error: "Permission denied"
- Verify the service account has the necessary permissions
- Check Firebase Console → IAM & Admin → Service Accounts
- Ensure Cloud Messaging API is enabled
