// API endpoint for sending push notifications
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Firebase Admin SDK configuration (you'll need to set up Firebase Admin SDK)
const firebaseConfig = {
  apiKey: "AIzaSyBjHLhECxsAW8DWN63tTVZSCExpT33tFUg",
  authDomain: "lifeline-37sh6.firebaseapp.com",
  projectId: "lifeline-37sh6",
  storageBucket: "lifeline-37sh6.firebasestorage.app",
  messagingSenderId: "24849207864",
  appId: "1:24849207864:web:ddfeef6f0efa16135c0ccd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, notification, data, userId, userEmail } = req.body;

    // Validate required fields
    if (!notification || !notification.title || !notification.body) {
      return res.status(400).json({ 
        error: 'Missing required fields: notification.title and notification.body' 
      });
    }

    let targetToken = token;

    // If no token provided, try to get token from user
    if (!targetToken && (userId || userEmail)) {
      targetToken = await getUserFCMToken(userId, userEmail);
    }

    if (!targetToken) {
      return res.status(400).json({ 
        error: 'No FCM token provided or found for user' 
      });
    }

    // Prepare the message
    const message = {
      token: targetToken,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: '/logo.png',
        badge: '/logo.png'
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      webpush: {
        notification: {
          icon: '/logo.png',
          badge: '/logo.png',
          actions: [
            {
              action: 'view',
              title: 'View',
              icon: '/logo.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ],
          requireInteraction: true
        }
      }
    };

    // Send the notification
    const response = await messaging.send(message);
    
    console.log('Successfully sent message:', response);
    
    return res.status(200).json({ 
      success: true, 
      messageId: response,
      message: 'Notification sent successfully' 
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message 
    });
  }
}

// Helper function to get user's FCM token
async function getUserFCMToken(userId, userEmail) {
  try {
    let userQuery;
    
    if (userId) {
      // Query by user ID
      userQuery = query(
        collection(db, 'users'),
        where('__name__', '==', userId)
      );
    } else if (userEmail) {
      // Query by email
      userQuery = query(
        collection(db, 'users'),
        where('email', '==', userEmail)
      );
    } else {
      return null;
    }

    const querySnapshot = await getDocs(userQuery);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return userData.fcmToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user FCM token:', error);
    return null;
  }
}

// Helper function to send notification to multiple users
export async function sendNotificationToUsers(userEmails, notification, data) {
  try {
    const results = [];
    
    for (const email of userEmails) {
      const token = await getUserFCMToken(null, email);
      
      if (token) {
        const message = {
          token: token,
          notification: {
            title: notification.title,
            body: notification.body,
            icon: '/logo.png',
            badge: '/logo.png'
          },
          data: {
            ...data,
            timestamp: new Date().toISOString()
          }
        };

        const response = await messaging.send(message);
        results.push({ email, success: true, messageId: response });
      } else {
        results.push({ email, success: false, error: 'No FCM token found' });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error sending notifications to users:', error);
    throw error;
  }
}

// Helper function to send notification to all users with a specific role
export async function sendNotificationToRole(role, notification, data) {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', role),
      where('pushNotificationsEnabled', '==', true)
    );

    const querySnapshot = await getDocs(usersQuery);
    const results = [];

    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      
      if (userData.fcmToken) {
        const message = {
          token: userData.fcmToken,
          notification: {
            title: notification.title,
            body: notification.body,
            icon: '/logo.png',
            badge: '/logo.png'
          },
          data: {
            ...data,
            timestamp: new Date().toISOString()
          }
        };

        const response = await messaging.send(message);
        results.push({ 
          email: userData.email, 
          success: true, 
          messageId: response 
        });
      } else {
        results.push({ 
          email: userData.email, 
          success: false, 
          error: 'No FCM token found' 
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error sending notifications to role:', error);
    throw error;
  }
}


