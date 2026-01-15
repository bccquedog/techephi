// Real Firebase Service Implementation
import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase.js';

class RealFirebaseService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.unsubscribeAuth = null;
    this.auth = null;
    this.db = null;
  }

  // Lazy initialization of Firebase services
  async initFirebase() {
    if (!this.auth || !this.db) {
      const firebase = await import('../firebase.js');
      this.auth = firebase.auth;
      this.db = firebase.db;
    }
    return { auth: this.auth, db: this.db };
  }

  // Initialize auth state listener
  async initAuthStateListener() {
    const { auth } = await this.initFirebase();
    this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  // Authentication Methods
  async signInWithEmailAndPassword(email, password) {
    try {
      const { auth } = await this.initFirebase();
      const userCredential = await firebaseSignIn(auth, email, password);
      const user = userCredential.user;
      
      // Get additional user profile data from Firestore
      const userProfile = await this.getUserProfile(user.uid);
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || userProfile?.displayName || email.split('@')[0],
          role: userProfile?.role || 'client'
        }
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async createUserWithEmailAndPassword(email, password, role = 'client') {
    try {
      const { auth } = await this.initFirebase();
      const userCredential = await firebaseCreateUser(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: email.split('@')[0]
      });
      
      // Save additional user data to Firestore
      await this.setUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        role: role,
        createdAt: new Date().toISOString()
      });
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role
        }
      };
    } catch (error) {
      console.error('Create user error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signOut() {
    try {
      const { auth } = await this.initFirebase();
      await firebaseSignOut(auth);
      this.currentUser = null;
      this.isAuthenticated = false;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // User Profile Methods
  async setUserProfile(uid, data) {
    try {
      const { db } = await this.initFirebase();
      await setDoc(doc(db, 'userProfiles', uid), data);
    } catch (error) {
      console.error('Set user profile error:', error);
      throw new Error('Failed to save user profile');
    }
  }

  async getUserProfile(uid) {
    try {
      const { db } = await this.initFirebase();
      const docRef = doc(db, 'userProfiles', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Jobs Methods
  async getJobs() {
    try {
      const { db } = await this.initFirebase();
      const jobsRef = collection(db, 'jobs');
      const querySnapshot = await getDocs(jobsRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get jobs error:', error);
      return [];
    }
  }

  async addJob(jobData) {
    try {
      const jobsRef = collection(db, 'jobs');
      const docRef = await addDoc(jobsRef, {
        ...jobData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...jobData };
    } catch (error) {
      console.error('Add job error:', error);
      throw new Error('Failed to create job');
    }
  }

  async updateJob(jobId, updates) {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { id: jobId, ...updates };
    } catch (error) {
      console.error('Update job error:', error);
      throw new Error('Failed to update job');
    }
  }

  // Invoices Methods
  async getInvoices() {
    try {
      const invoicesRef = collection(db, 'invoices');
      const querySnapshot = await getDocs(invoicesRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get invoices error:', error);
      return [];
    }
  }

  async addInvoice(invoiceData) {
    try {
      const invoicesRef = collection(db, 'invoices');
      const docRef = await addDoc(invoicesRef, {
        ...invoiceData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...invoiceData };
    } catch (error) {
      console.error('Add invoice error:', error);
      throw new Error('Failed to create invoice');
    }
  }

  // Clients Methods
  async getClients() {
    try {
      const clientsRef = collection(db, 'clients');
      const querySnapshot = await getDocs(clientsRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get clients error:', error);
      return [];
    }
  }

  async addClient(clientData) {
    try {
      const clientsRef = collection(db, 'clients');
      const docRef = await addDoc(clientsRef, {
        ...clientData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...clientData };
    } catch (error) {
      console.error('Add client error:', error);
      throw new Error('Failed to add client');
    }
  }

  // Messages Methods
  async getConversations() {
    try {
      const conversationsRef = collection(db, 'conversations');
      const querySnapshot = await getDocs(conversationsRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get conversations error:', error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get messages error:', error);
      return [];
    }
  }

  async sendMessage(messageData) {
    try {
      const messagesRef = collection(db, 'messages');
      const docRef = await addDoc(messagesRef, {
        ...messageData,
        timestamp: new Date().toISOString()
      });
      return { id: docRef.id, ...messageData };
    } catch (error) {
      console.error('Send message error:', error);
      throw new Error('Failed to send message');
    }
  }

  // Utility Methods
  getAuthErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email address is already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'Authentication failed';
    }
  }

  // Role determination helper
  determineRole(email) {
    if (email.includes('support@techephi.com')) return 'admin';
    if (email.includes('@techephi.com')) return 'contractor';
    return 'client';
  }

  // Cleanup
  destroy() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  }
}

export default RealFirebaseService;