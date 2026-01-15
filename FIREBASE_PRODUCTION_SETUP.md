# Firebase Production Setup Guide

## Current Configuration
- **Project ID**: `lifeline-37sh6`
- **API Key**: `AIzaSyBjHLhECxsAW8DWN63tTVZSCExpT33tFUg`
- **Auth Domain**: `lifeline-37sh6.firebaseapp.com`

## Required Firebase Services Setup

### 1. Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/project/lifeline-37sh6)
2. Navigate to **Firestore Database** in the left sidebar
3. Click **Create Database**
4. Choose **Start in test mode** (for development) or **Start in production mode** (for production)
5. Select a location (recommend: `us-central1` or `us-east1`)

### 2. Firestore Security Rules
Replace the default rules with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == resource.data.userEmail;
    }
    
    // Allow authenticated users to read/write jobs
    match /jobs/{jobId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write clients
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write contractors
    match /contractors/{contractorId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write schedule events
    match /scheduleEvents/{eventId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write emails
    match /emails/{emailId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write invoices
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write files
    match /files/{fileId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in resource.data.participants;
    }
    
    // Allow authenticated users to read/write messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write notification preferences
    match /notificationPreferences/{userEmail} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == userEmail;
    }
  }
}
```

### 3. Authentication Setup
1. Go to **Authentication** in Firebase Console
2. Click **Get started**
3. Enable **Email/Password** authentication
4. Add your domain to authorized domains (for production)

### 4. Storage Setup (if needed)
1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Choose security rules (start with test mode)

### 5. API Key Restrictions (Recommended for Production)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your Firebase API key
3. Set restrictions:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Restrict to Firebase services

## Testing the Setup

After completing the setup:

1. **Check Firestore**: The 400 errors should stop
2. **Test Authentication**: Try logging in with real credentials
3. **Test Data Operations**: Create, read, update, delete operations should work

## Production Deployment

1. **Environment Variables**: Ensure all Firebase config is set in production
2. **Security Rules**: Use production security rules (not test mode)
3. **Domain Authorization**: Add your production domain to Firebase Auth
4. **API Key Restrictions**: Set proper restrictions for production

## Troubleshooting

### 400 Bad Request Errors
- Check if Firestore Database is created
- Verify security rules are not too restrictive
- Ensure API key has proper permissions

### Authentication Issues
- Check if Authentication is enabled
- Verify domain is authorized
- Check API key restrictions

### Permission Denied Errors
- Review Firestore security rules
- Ensure user is authenticated
- Check if user has proper permissions
