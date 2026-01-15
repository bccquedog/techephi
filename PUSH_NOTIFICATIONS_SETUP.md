# Push Notifications Setup - Tech ePhi CRM

## 🔔 Overview

This document describes the push notification implementation for the Tech ePhi CRM application. The system uses Firebase Cloud Messaging (FCM) to deliver real-time notifications to users.

## 🚀 Features

- **Real-time push notifications** for web browsers
- **Background message handling** when app is not active
- **Foreground message handling** when app is active
- **Notification click handling** with deep linking
- **User-specific token management**
- **Test notification functionality**

## 📋 Prerequisites

1. **Firebase Project** configured with Cloud Messaging enabled
2. **VAPID Key** generated for web push notifications
3. **Service Worker** support in target browsers
4. **HTTPS** (required for push notifications in production)

## 🔧 Configuration

### Firebase Configuration

The Firebase configuration is located in:
- `src/firebase.js` - Main Firebase setup
- `public/firebase-messaging-sw.js` - Service worker for background messages

### VAPID Key

The VAPID key used for push notifications:
```
BIVWZ68ibkYf8J6neoJO4FFWQIy4O3-c5p9k86AYFJ0M4yCWk4UCubVoNEBlU-PXu2N7CTWcm2VnJ7_QGJ6EydY
```

## 📁 File Structure

```
src/
├── services/
│   └── pushNotifications.js          # Push notification service
├── firebase.js                       # Firebase configuration
└── App.jsx                          # Main app with notification integration

public/
└── firebase-messaging-sw.js         # Service worker for background messages

api/
└── send-notification.js             # API endpoint for sending notifications

test-push-notifications.html         # Test page for push notifications
```

## 🔨 Implementation Details

### 1. Service Worker (`public/firebase-messaging-sw.js`)

Handles background messages and notification clicks:

- **Background Message Handling**: Shows notifications when app is not active
- **Notification Click Handling**: Opens app and navigates to relevant content
- **Action Buttons**: View and Dismiss actions
- **Deep Linking**: Routes to specific pages based on notification type

### 2. Push Notification Service (`src/services/pushNotifications.js`)

Main service for managing push notifications:

- **Permission Request**: Requests notification permission from user
- **Token Management**: Gets and stores FCM tokens
- **Message Handling**: Handles foreground messages
- **User Integration**: Saves tokens to user profiles

### 3. API Endpoint (`api/send-notification.js`)

Server-side endpoint for sending notifications:

- **Token-based Sending**: Sends to specific FCM tokens
- **User-based Sending**: Sends to users by email or ID
- **Role-based Sending**: Sends to all users with specific role
- **Bulk Sending**: Sends to multiple users

## 🧪 Testing

### Test Page

Use the test page at `test-push-notifications.html` to:

1. **Check Browser Support**: Verify notification and service worker support
2. **Request Permission**: Test permission request flow
3. **Get FCM Token**: Retrieve and display FCM token
4. **Send Test Notification**: Send a test notification

### In-App Testing

The app includes a test notification center in the settings panel:

1. Navigate to **Settings** → **Notifications**
2. Use the **"Send Push Notification Test"** button
3. Check browser console for logs

## 📱 Usage

### Initialization

Push notifications are automatically initialized when:
- The app loads (in AuthProvider)
- A user logs in
- The service worker registers

### Sending Notifications

#### From Frontend
```javascript
import pushNotificationService from './services/pushNotifications.js';

// Send test notification
await pushNotificationService.sendTestNotification();
```

#### From Backend API
```javascript
// Send to specific token
POST /api/send-notification
{
  "token": "fcm-token-here",
  "notification": {
    "title": "Notification Title",
    "body": "Notification body text"
  },
  "data": {
    "type": "job",
    "jobId": "123"
  }
}

// Send to user by email
POST /api/send-notification
{
  "userEmail": "user@example.com",
  "notification": {
    "title": "Notification Title",
    "body": "Notification body text"
  }
}
```

## 🔒 Security

### Token Management

- FCM tokens are stored in user profiles
- Tokens are updated when users log in
- Tokens can be disabled per user preference

### Permission Handling

- Users must explicitly grant notification permission
- Permission status is checked before sending notifications
- Graceful fallback when permissions are denied

## 🐛 Troubleshooting

### Common Issues

1. **"No FCM token available"**
   - Check if user has granted notification permission
   - Verify service worker is registered
   - Check browser console for errors

2. **"Service worker registration failed"**
   - Ensure `firebase-messaging-sw.js` is in the public directory
   - Check that the file is accessible via HTTPS
   - Verify Firebase configuration

3. **"Notification permission denied"**
   - User must manually enable notifications in browser settings
   - Some browsers require user interaction before requesting permission

4. **"Background messages not showing"**
   - Check service worker is active
   - Verify `onBackgroundMessage` handler is working
   - Check browser notification settings

### Debug Steps

1. **Check Browser Console**: Look for Firebase and service worker errors
2. **Test Service Worker**: Use browser dev tools to inspect service worker
3. **Verify Token**: Use test page to confirm FCM token is valid
4. **Check Network**: Ensure API calls to `/api/send-notification` are working

## 📊 Monitoring

### Logs

The system logs important events:
- FCM token generation and updates
- Permission requests and responses
- Message sending success/failure
- Service worker registration status

### Analytics

Consider adding analytics to track:
- Notification permission rates
- Token registration success rates
- Message delivery rates
- User engagement with notifications

## 🚀 Production Deployment

### Requirements

1. **HTTPS**: Required for push notifications
2. **Valid SSL Certificate**: For service worker registration
3. **Firebase Project**: Properly configured with Cloud Messaging
4. **VAPID Keys**: Generated and configured in Firebase Console

### Environment Variables

Ensure these are set in production:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 📚 Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

## ✅ Checklist

- [x] Firebase Cloud Messaging enabled
- [x] VAPID key configured
- [x] Service worker implemented
- [x] Push notification service created
- [x] API endpoint for sending notifications
- [x] Test page created
- [x] Integration with main app
- [x] Error handling implemented
- [x] Documentation created

## 🎉 Success!

Push notifications are now fully implemented and ready for use! Users will receive real-time notifications for:

- New messages in conversations
- Job status updates
- Invoice notifications
- System announcements
- And more!

The system gracefully handles permission requests, token management, and provides comprehensive error handling for a smooth user experience.


