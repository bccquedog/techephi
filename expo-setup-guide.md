# Expo Setup Guide for Tech Portal iOS App

## 🚀 **Quick Start**

### **1. Install Expo CLI**
```bash
npm install -g @expo/cli
```

### **2. Create New Expo Project**
```bash
npx create-expo-app@latest tech-portal-mobile --template blank-typescript
cd tech-portal-mobile
```

### **3. Install Essential Dependencies**
```bash
# Navigation
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# Firebase
npm install firebase

# Stripe
npx expo install @stripe/stripe-react-native

# Notifications
npx expo install expo-notifications

# File System
npx expo install expo-file-system expo-document-picker

# Storage
npx expo install @react-native-async-storage/async-storage

# UI Components
npm install react-native-elements
npm install react-native-vector-icons

# Utilities
npm install date-fns
npm install react-native-gesture-handler
```

### **4. Configure app.json**
```json
{
  "expo": {
    "name": "Tech Portal",
    "slug": "tech-portal-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3B0A69"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.techephi.techportal"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3B0A69"
      },
      "package": "com.techephi.techportal"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-notifications",
      "@stripe/stripe-react-native"
    ]
  }
}
```

### **5. Project Structure Setup**
```bash
mkdir -p src/{components,screens,services,navigation,hooks,utils,types}
mkdir -p assets/{images,icons}
```

### **6. Basic Navigation Setup**
```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JobsScreen from '../screens/JobsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Jobs" component={JobsScreen} />
        <Stack.Screen name="Invoices" component={InvoicesScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### **7. Firebase Configuration**
```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config from web app
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### **8. Start Development**
```bash
npx expo start
```

## 📱 **Key Features to Implement**

### **Authentication Flow**
- Login/Register screens
- Role-based navigation
- Biometric authentication
- Session management

### **Dashboard**
- Quick stats cards
- Recent activity feed
- Quick action buttons
- Notifications center

### **Job Management**
- Job list with search/filter
- Job details with tasks
- Progress tracking
- Time logging

### **Invoice Management**
- Invoice list
- Payment processing
- Payment history
- Receipt generation

### **Messaging**
- Conversation list
- Real-time chat
- File sharing
- Push notifications

## 🔧 **Development Tips**

### **Code Reuse Strategy**
1. **Shared Business Logic**: Move common functions to shared utilities
2. **Component Adaptation**: Adapt web components for mobile
3. **API Integration**: Reuse existing API endpoints
4. **State Management**: Use similar patterns as web app

### **Performance Optimization**
- Lazy loading for screens
- Image optimization
- Memory management
- Background task handling

### **Testing Strategy**
- Unit tests for utilities
- Integration tests for API calls
- E2E tests for critical flows
- Device testing on multiple iOS versions

## 🚀 **Deployment Checklist**

### **Pre-Launch**
- [ ] App icon and splash screen
- [ ] App store screenshots
- [ ] Privacy policy
- [ ] Terms of service
- [ ] App store metadata

### **Testing**
- [ ] Device testing (iPhone/iPad)
- [ ] iOS version compatibility
- [ ] Performance testing
- [ ] Security testing

### **App Store**
- [ ] App store connect setup
- [ ] Beta testing with TestFlight
- [ ] App review submission
- [ ] Launch preparation

## 💡 **Next Steps**

1. **Set up the basic project structure**
2. **Implement authentication flow**
3. **Create core screens**
4. **Integrate with existing backend**
5. **Add push notifications**
6. **Test thoroughly**
7. **Deploy to App Store**

---

**This setup will give you a solid foundation for building your tech portal iOS app with Expo!**
