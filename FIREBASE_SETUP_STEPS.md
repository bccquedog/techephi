# Firebase Setup - Step by Step Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Access Firebase Console
1. **Open**: https://console.firebase.google.com/project/lifeline-37sh6
2. **Sign in** with your Google account

### Step 2: Create Firestore Database
1. **Click** "Firestore Database" in the left sidebar
2. **Click** "Create Database" button
3. **Choose** "Start in test mode" (we'll secure it later)
4. **Select location**: `us-central1` (recommended)
5. **Click** "Done"

### Step 3: Enable Authentication
1. **Click** "Authentication" in the left sidebar
2. **Click** "Get started"
3. **Click** "Email/Password" tab
4. **Toggle** "Enable" to ON
5. **Click** "Save"

### Step 4: Set Security Rules (Optional but Recommended)
1. **Go back** to "Firestore Database"
2. **Click** "Rules" tab
3. **Replace** the rules with:

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
      allow read, write: if request.auth != null;
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
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write notification preferences
    match /notificationPreferences/{userEmail} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Click** "Publish"

## ✅ Verification Steps

After completing the setup:

1. **Visit your app**: https://techephi.com
2. **Try to register** a new user
3. **Try to login** with the registered user
4. **Create a job** or client
5. **Check browser console** - no more 400 errors!

## 🔧 Troubleshooting

### If you still see 400 errors:
1. **Check Firebase Console** - ensure Firestore is created
2. **Check Authentication** - ensure Email/Password is enabled
3. **Check Security Rules** - ensure they're not too restrictive
4. **Clear browser cache** and try again

### If registration/login doesn't work:
1. **Check Authentication** in Firebase Console
2. **Verify domain** is authorized (add localhost for testing)
3. **Check browser console** for specific error messages

## 📞 Need Help?

If you encounter any issues:
1. **Check the browser console** for error messages
2. **Verify each step** in Firebase Console
3. **Test with a fresh browser window**

## 🎯 Expected Result

After completing this setup:
- ✅ No more 400 Bad Request errors
- ✅ User registration works
- ✅ User login works
- ✅ Data operations work (create, read, update, delete)
- ✅ Real-time features work
