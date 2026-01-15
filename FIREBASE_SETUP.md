# Firebase Setup Guide

## Environment Variables Required

Create a `.env` file in the root directory with the following Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Getting Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
4. Copy the configuration values from the Firebase SDK setup

## Firebase Services Used

- **Authentication**: Email/password sign-in
- **Firestore**: Database for jobs, clients, invoices, messages
- **Storage**: File uploads (if needed)

## Authentication Flow

The application now uses real Firebase authentication:

1. **Sign In**: Users enter email and password
2. **Role Detection**: Based on email domain (@techephi.com for admin/contractor)
3. **Profile Storage**: User profiles stored in Firestore
4. **Real-time Updates**: Auth state changes trigger UI updates

## Testing

To test the application:

1. Set up the environment variables
2. Run `npm run dev`
3. Click "Client Portal" to access the login form
4. Create accounts or use existing Firebase users

## Security Rules

Make sure to set up appropriate Firestore security rules for your Firebase project. 