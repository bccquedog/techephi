// Firebase Service Configuration
// Production-ready Firebase service (mock services removed)

import RealFirebaseService from './RealFirebaseService.js';

// Create and export a singleton instance
const firebaseService = new RealFirebaseService();

export default firebaseService;
