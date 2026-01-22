// API endpoint for sending push notifications using Firebase Admin SDK
import { adminFirestore, adminMessaging } from './firebase-admin.js';

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

    // Send the notification using Firebase Admin SDK
    const response = await adminMessaging.send(message);
    
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

// Helper function to get user's FCM token using Firebase Admin SDK
async function getUserFCMToken(userId, userEmail) {
  try {
    let userDoc;
    
    if (userId) {
      // Query by user ID
      userDoc = await adminFirestore.collection('users').doc(userId).get();
    } else if (userEmail) {
      // Query by email
      const snapshot = await adminFirestore.collection('users')
        .where('email', '==', userEmail)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        userDoc = snapshot.docs[0];
      }
    } else {
      return null;
    }

    if (userDoc && userDoc.exists) {
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

        const response = await adminMessaging.send(message);
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
    const snapshot = await adminFirestore.collection('users')
      .where('role', '==', role)
      .where('pushNotificationsEnabled', '==', true)
      .get();

    const results = [];

    for (const doc of snapshot.docs) {
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

        const response = await adminMessaging.send(message);
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


