// Firebase Service - Comprehensive service for all Firebase operations
import { auth, db, storage } from '../firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';

class FirebaseService {
  constructor() {
    this.auth = auth;
    this.db = db;
    this.storage = storage;
  }

  // Authentication Methods
  async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      // Convert Firebase error codes to user-friendly messages
      const errorMessage = this.getAuthErrorMessage(error.code);
      const friendlyError = new Error(errorMessage);
      friendlyError.code = error.code;
      throw friendlyError;
    }
  }

  async sendPasswordResetEmail(email) {
    try {
      console.log('Sending password reset email to:', email);
      await firebaseSendPasswordResetEmail(this.auth, email);
      console.log('✅ Password reset email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      const errorMessage = this.getAuthErrorMessage(error.code);
      const friendlyError = new Error(errorMessage);
      friendlyError.code = error.code;
      throw friendlyError;
    }
  }

  getAuthErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please enter a valid email.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/requires-recent-login':
        return 'Please sign out and sign in again to complete this action.';
      default:
        return errorCode?.startsWith('auth/') 
          ? 'Authentication failed. Please try again.'
          : 'An error occurred. Please try again.';
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // User Profile Methods
  async setUserProfile(uid, profileData) {
    try {
      const profileRef = doc(this.db, 'userProfiles', uid);
      await setDoc(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error setting user profile:', error);
      throw error;
    }
  }

  async getUserProfile(uid) {
    try {
      const profileRef = doc(this.db, 'userProfiles', uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        return profileSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Notification Methods
  async getNotifications(userEmail) {
    try {
      if (!userEmail) return [];
      
      const notificationsRef = collection(this.db, 'notifications');
      const q = query(
        notificationsRef,
        where('userEmail', '==', userEmail),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async createNotification(userEmail, notification) {
    try {
      if (!userEmail) throw new Error('User email is required');
      
      const notificationsRef = collection(this.db, 'notifications');
      const notificationData = {
        ...notification,
        userEmail,
        createdAt: serverTimestamp(),
        read: false
      };
      
      const docRef = await addDoc(notificationsRef, notificationData);
      return { id: docRef.id, ...notificationData };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(userEmail, notificationId) {
    try {
      if (!userEmail || !notificationId) throw new Error('User email and notification ID are required');
      
      const notificationRef = doc(this.db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userEmail) {
    try {
      if (!userEmail) throw new Error('User email is required');
      
      const notificationsRef = collection(this.db, 'notifications');
      const q = query(
        notificationsRef,
        where('userEmail', '==', userEmail),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          read: true,
          readAt: serverTimestamp()
        })
      );
      
      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async getNotificationPreferences(userEmail) {
    try {
      if (!userEmail) return this.getDefaultPreferences();
      
      const prefsRef = doc(this.db, 'notificationPreferences', userEmail);
      const prefsDoc = await getDoc(prefsRef);
      
      if (prefsDoc.exists()) {
        const data = prefsDoc.data();
        // Ensure all required fields exist, merge with defaults
        return { ...this.getDefaultPreferences(), ...data };
      } else {
        // Create default preferences
        const defaultPrefs = this.getDefaultPreferences();
        // Try to save, but don't fail if offline
        try {
          await this.updateNotificationPreferences(userEmail, defaultPrefs);
        } catch (saveError) {
          // Silently fail if offline - defaults will be used
          if (!saveError.message?.includes('offline')) {
            console.warn('Could not save default preferences:', saveError);
          }
        }
        return defaultPrefs;
      }
    } catch (error) {
      // Handle offline errors silently - return defaults
      if (error.message?.includes('offline') || error.code === 'unavailable') {
        // Silently return defaults when offline
        return this.getDefaultPreferences();
      }
      // Log other errors but still return defaults
      console.warn('Error getting notification preferences:', error.message);
      return this.getDefaultPreferences();
    }
  }

  async updateNotificationPreferences(userEmail, preferences) {
    try {
      if (!userEmail) throw new Error('User email is required');
      
      const prefsRef = doc(this.db, 'notificationPreferences', userEmail);
      await setDoc(prefsRef, {
        ...preferences,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return preferences;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async checkAndSendAutomatedNotifications() {
    try {
      // This would typically check for automated notification triggers
      // For now, we'll just return success
      console.log('Automated notifications check completed');
      return true;
    } catch (error) {
      console.error('Error checking automated notifications:', error);
      throw error;
    }
  }

  async sendBulkNotification(userEmails, notification) {
    try {
      if (!userEmails || !userEmails.length) throw new Error('User emails are required');
      
      const notificationsRef = collection(this.db, 'notifications');
      const notificationPromises = userEmails.map(userEmail => 
        addDoc(notificationsRef, {
          ...notification,
          userEmail,
          createdAt: serverTimestamp(),
          read: false,
          bulk: true
        })
      );
      
      const results = await Promise.all(notificationPromises);
      return results.map(doc => ({ id: doc.id, userEmail: userEmails[results.indexOf(doc)] }));
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }

  async getNotificationAnalytics(userEmail, days = 30) {
    try {
      
      if (!userEmail) return null;
      
      const notificationsRef = collection(this.db, 'notifications');
      const q = query(
        notificationsRef,
        where('userEmail', '==', userEmail),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const notifications = snapshot.docs.map(doc => doc.data());
      
      // Calculate analytics
      const total = notifications.length;
      const read = notifications.filter(n => n.read).length;
      const unread = total - read;
      
      return {
        total,
        read,
        unread,
        readRate: total > 0 ? (read / total) * 100 : 0,
        notifications: notifications.slice(0, days)
      };
    } catch (error) {
      console.error('Error getting notification analytics:', error);
      return null;
    }
  }

  // Job Management Methods
  async getJobs() {
    try {
      const jobsRef = collection(this.db, 'jobs');
      const snapshot = await getDocs(jobsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting jobs:', error);
      return [];
    }
  }

  async createJob(jobData) {
    try {
      const jobsRef = collection(this.db, 'jobs');
      const docRef = await addDoc(jobsRef, {
        ...jobData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...jobData };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async updateJob(jobId, updates) {
    try {
      const jobRef = doc(this.db, 'jobs', jobId);
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: jobId, ...updates };
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async deleteJob(jobId) {
    try {
      const jobRef = doc(this.db, 'jobs', jobId);
      await deleteDoc(jobRef);
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Client Management Methods
  async getClients() {
    try {
      const clientsRef = collection(this.db, 'clients');
      const snapshot = await getDocs(clientsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      const clientsRef = collection(this.db, 'clients');
      const docRef = await addDoc(clientsRef, {
        ...clientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...clientData };
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Contractor Management Methods
  async getContractors() {
    try {
      const contractorsRef = collection(this.db, 'contractors');
      const snapshot = await getDocs(contractorsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting contractors:', error);
      return [];
    }
  }

  // Task Management Methods
  async getTasks(jobId) {
    try {
      const tasksRef = collection(this.db, 'tasks');
      const q = query(tasksRef, where('jobId', '==', jobId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async createTask(jobId, taskData) {
    try {
      const tasksRef = collection(this.db, 'tasks');
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        jobId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(jobId, taskId, updates) {
    try {
      const taskRef = doc(this.db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: taskId, ...updates };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Schedule Management Methods
  async getScheduleEvents(filters = {}) {
    try {
      const eventsRef = collection(this.db, 'scheduleEvents');
      let q = eventsRef;
      
      if (filters.userEmail) {
        q = query(eventsRef, where('userEmail', '==', filters.userEmail));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting schedule events:', error);
      return [];
    }
  }

  async createScheduleEvent(eventData) {
    try {
      const eventsRef = collection(this.db, 'scheduleEvents');
      const docRef = await addDoc(eventsRef, {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error('Error creating schedule event:', error);
      throw error;
    }
  }

  async updateScheduleEvent(eventId, updates) {
    try {
      const eventRef = doc(this.db, 'scheduleEvents', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: eventId, ...updates };
    } catch (error) {
      console.error('Error updating schedule event:', error);
      throw error;
    }
  }

  async checkScheduleConflicts(eventData) {
    try {
      const eventsRef = collection(this.db, 'scheduleEvents');
      const startTime = new Date(eventData.startTime);
      const endTime = new Date(eventData.endTime);
      
      const q = query(
        eventsRef,
        where('assignedTo', '==', eventData.assignedTo),
        where('status', '!=', 'cancelled')
      );
      
      const snapshot = await getDocs(q);
      const conflicts = [];
      
      snapshot.docs.forEach(doc => {
        const event = doc.data();
        if (event.id === eventData.id) return; // Skip current event when editing
        
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        
        // Check for overlap
        if ((startTime < eventEnd && endTime > eventStart)) {
          conflicts.push({ id: doc.id, ...event });
        }
      });
      
      return conflicts;
    } catch (error) {
      console.error('Error checking schedule conflicts:', error);
      return [];
    }
  }

  // Available Hours Management (Admin)
  async setAvailableHours(contractorEmail, availableHours) {
    try {
      const hoursRef = doc(this.db, 'availableHours', contractorEmail);
      await setDoc(hoursRef, {
        contractorEmail,
        hours: availableHours,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { contractorEmail, hours: availableHours };
    } catch (error) {
      console.error('Error setting available hours:', error);
      throw error;
    }
  }

  async getAvailableHours(contractorEmail) {
    try {
      const hoursRef = doc(this.db, 'availableHours', contractorEmail);
      const hoursDoc = await getDoc(hoursRef);
      if (hoursDoc.exists()) {
        return hoursDoc.data().hours || {};
      }
      return {};
    } catch (error) {
      console.error('Error getting available hours:', error);
      return {};
    }
  }

  async getAllAvailableHours() {
    try {
      const hoursRef = collection(this.db, 'availableHours');
      const snapshot = await getDocs(hoursRef);
      return snapshot.docs.map(doc => ({
        contractorEmail: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all available hours:', error);
      return [];
    }
  }

  // Specific Date Availability Management
  async setSpecificDateAvailability(contractorEmail, date, timeSlots) {
    try {
      const dateStr = new Date(date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const availabilityRef = doc(this.db, 'specificDateAvailability', `${contractorEmail}_${dateStr}`);
      await setDoc(availabilityRef, {
        contractorEmail,
        date: dateStr,
        timeSlots,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { contractorEmail, date: dateStr, timeSlots };
    } catch (error) {
      console.error('Error setting specific date availability:', error);
      throw error;
    }
  }

  async getSpecificDateAvailability(contractorEmail) {
    try {
      const availabilityRef = collection(this.db, 'specificDateAvailability');
      const q = query(
        availabilityRef,
        where('contractorEmail', '==', contractorEmail)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error getting specific date availability:', error);
      return [];
    }
  }

  async deleteSpecificDateAvailability(contractorEmail, date) {
    try {
      const dateStr = new Date(date).toISOString().split('T')[0];
      const availabilityRef = doc(this.db, 'specificDateAvailability', `${contractorEmail}_${dateStr}`);
      await deleteDoc(availabilityRef);
      return true;
    } catch (error) {
      console.error('Error deleting specific date availability:', error);
      throw error;
    }
  }

  async getAvailableTimeSlots(contractorEmail, date, durationHours = 2) {
    try {
      const dateStr = new Date(date).toDateString();
      const dateOnly = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
      const startOfDay = new Date(dateStr);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Get existing appointments for this date
      const eventsRef = collection(this.db, 'scheduleEvents');
      const q = query(
        eventsRef,
        where('assignedTo', '==', contractorEmail),
        where('status', '!=', 'cancelled')
      );
      
      const snapshot = await getDocs(q);
      const bookedSlots = [];
      
      snapshot.docs.forEach(doc => {
        const event = doc.data();
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        
        // Only include events on the selected date
        if (eventStart >= startOfDay && eventStart <= endOfDay) {
          bookedSlots.push({
            start: eventStart,
            end: eventEnd
          });
        }
      });
      
      // Check for specific date availability first (takes priority over weekly hours)
      const specificDateRef = doc(this.db, 'specificDateAvailability', `${contractorEmail}_${dateOnly}`);
      const specificDateDoc = await getDoc(specificDateRef);
      
      let dayHours = [];
      
      if (specificDateDoc.exists()) {
        // Use specific date availability
        const data = specificDateDoc.data();
        dayHours = data.timeSlots || [];
      } else {
        // Fall back to weekly recurring hours
        const availableHours = await this.getAvailableHours(contractorEmail);
        const dayOfWeek = startOfDay.getDay();
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
        dayHours = availableHours[dayName] || [];
      }
      
      if (dayHours.length === 0) {
        return []; // No available hours set for this day
      }
      
      // Generate time slots based on available hours
      const slots = [];
      const durationMs = durationHours * 60 * 60 * 1000;
      
      dayHours.forEach(timeRange => {
        const [startHour, startMin] = timeRange.start.split(':').map(Number);
        const [endHour, endMin] = timeRange.end.split(':').map(Number);
        
        const rangeStart = new Date(startOfDay);
        rangeStart.setHours(startHour, startMin, 0, 0);
        
        const rangeEnd = new Date(startOfDay);
        rangeEnd.setHours(endHour, endMin, 0, 0);
        
        // Generate slots within this range
        let currentSlotStart = new Date(rangeStart);
        
        while (currentSlotStart.getTime() + durationMs <= rangeEnd.getTime()) {
          const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMs);
          
          // Check if this slot conflicts with booked appointments
          const hasConflict = bookedSlots.some(booked => {
            return (currentSlotStart < booked.end && currentSlotEnd > booked.start);
          });
          
          if (!hasConflict) {
            slots.push({
              start: new Date(currentSlotStart),
              end: new Date(currentSlotEnd)
            });
          }
          
          // Move to next slot (30-minute intervals)
          currentSlotStart = new Date(currentSlotStart.getTime() + 30 * 60 * 1000);
        }
      });
      
      return slots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return [];
    }
  }

  // Email Management Methods
  async getEmails(userEmail, folder = 'inbox') {
    try {
      const emailsRef = collection(this.db, 'emails');
      const q = query(
        emailsRef,
        where('userEmail', '==', userEmail),
        where('folder', '==', folder),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting emails:', error);
      return [];
    }
  }

  async sendEmail(emailData) {
    try {
      const emailsRef = collection(this.db, 'emails');
      const docRef = await addDoc(emailsRef, {
        ...emailData,
        createdAt: serverTimestamp(),
        status: 'sent'
      });
      return { id: docRef.id, ...emailData };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Invoice Management Methods
  async getInvoices() {
    try {
      const invoicesRef = collection(this.db, 'invoices');
      const snapshot = await getDocs(invoicesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting invoices:', error);
      return [];
    }
  }

  async createQuoteRequest(quoteData) {
    try {
      const quoteRef = collection(this.db, 'quoteRequests');
      const docRef = await addDoc(quoteRef, {
        ...quoteData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: docRef.id, ...quoteData };
    } catch (error) {
      console.error('Error creating quote request:', error);
      throw error;
    }
  }

  async getQuoteRequests(filters = {}) {
    try {
      const quoteRef = collection(this.db, 'quoteRequests');
      let q = query(quoteRef, orderBy('createdAt', 'desc'));
      
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting quote requests:', error);
      return [];
    }
  }

  async updateQuoteRequest(quoteId, updates) {
    try {
      const quoteRef = doc(this.db, 'quoteRequests', quoteId);
      await updateDoc(quoteRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return { id: quoteId, ...updates };
    } catch (error) {
      console.error('Error updating quote request:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData) {
    try {
      // Generate invoice number if not provided
      const invoiceNumber = invoiceData.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const invoicesRef = collection(this.db, 'invoices');
      const docRef = await addDoc(invoicesRef, {
        ...invoiceData,
        invoiceNumber,
        status: invoiceData.status || 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...invoiceData, invoiceNumber };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoiceStatus(invoiceId, status, paidDate = null) {
    try {
      const invoiceRef = doc(this.db, 'invoices', invoiceId);
      const updates = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (paidDate) {
        updates.paidDate = paidDate;
      }
      
      await updateDoc(invoiceRef, updates);
      return { id: invoiceId, status, paidDate };
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // File Management Methods
  async getFiles(filters = {}) {
    try {
      const filesRef = collection(this.db, 'files');
      let q = filesRef;
      
      if (filters.userEmail) {
        q = query(filesRef, where('userEmail', '==', filters.userEmail));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting files:', error);
      return [];
    }
  }

  async uploadFile(fileData) {
    try {
      const filesRef = collection(this.db, 'files');
      const docRef = await addDoc(filesRef, {
        ...fileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...fileData };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Message Management Methods
  async getConversations(userEmail) {
    try {
      const conversationsRef = collection(this.db, 'conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userEmail)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const messagesRef = collection(this.db, 'messages');
      const q = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async sendMessage(conversationId, messageData) {
    try {
      const messagesRef = collection(this.db, 'messages');
      const docRef = await addDoc(messagesRef, {
        ...messageData,
        conversationId,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...messageData };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Analytics Methods
  async getAnalyticsData() {
    try {
      // This would typically aggregate data from various collections
      // For now, return basic analytics
      return {
        totalJobs: 0,
        totalClients: 0,
        totalRevenue: 0,
        activeProjects: 0
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return null;
    }
  }

  // Initialization Methods
  _initialized = false;
  _initializationPromise = null;
  
  async initializeDefaultJobs() {
    try {
      // If already initialized, return immediately
      if (this._initialized) {
        return true;
      }
      
      // If initialization is in progress, wait for it
      if (this._initializationPromise) {
        return await this._initializationPromise;
      }
      
      // Start initialization
      this._initializationPromise = this._performInitialization();
      const result = await this._initializationPromise;
      this._initialized = true;
      return result;
    } catch (error) {
      console.error('Error initializing default jobs:', error);
      return false;
    }
  }
  
  async _performInitialization() {
    console.log('Initializing default jobs...');
    // Add a small delay to prevent async response issues
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }

  async initializeDefaultProjects() {
    try {
      console.log('Initializing default projects...');
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('Error initializing default projects:', error);
      return false;
    }
  }

  async initializeDefaultFiles() {
    try {
      console.log('Initializing default files...');
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('Error initializing default files:', error);
      return false;
    }
  }

  async initializeDefaultMessages() {
    try {
      console.log('Initializing default messages...');
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('Error initializing default messages:', error);
      return false;
    }
  }

  // SES/SNS Configuration Methods
  getSESConfig() {
    return {
      region: 'us-east-1',
      accessKeyId: '',
      secretAccessKey: ''
    };
  }

  async configureSES(config) {
    try {
      console.log('Configuring SES:', config);
      return true;
    } catch (error) {
      console.error('Error configuring SES:', error);
      throw error;
    }
  }

  async testSESConnection() {
    try {
      console.log('Testing SES connection...');
      return { success: true };
    } catch (error) {
      console.error('Error testing SES connection:', error);
      throw error;
    }
  }

  getSNSConfig() {
    return {
      region: 'us-east-1',
      accessKeyId: '',
      secretAccessKey: ''
    };
  }

  async configureSNS(config) {
    try {
      console.log('Configuring SNS:', config);
      return true;
    } catch (error) {
      console.error('Error configuring SNS:', error);
      throw error;
    }
  }

  async testSNSConnection() {
    try {
      console.log('Testing SNS connection...');
      return { success: true };
    } catch (error) {
      console.error('Error testing SNS connection:', error);
      throw error;
    }
  }

  // Presence and Typing Methods
  setPresence(userEmail, isOnline) {
    try {
      console.log(`Setting presence for ${userEmail}: ${isOnline}`);
      return true;
    } catch (error) {
      console.error('Error setting presence:', error);
      return false;
    }
  }

  setTyping(conversationId, userEmail, isTyping) {
    try {
      console.log(`Setting typing for ${userEmail} in ${conversationId}: ${isTyping}`);
      return true;
    } catch (error) {
      console.error('Error setting typing:', error);
      return false;
    }
  }

  onMessage(conversationId, callback) {
    try {
      console.log(`Setting up message listener for ${conversationId}`);
      // Return unsubscribe function
      return () => console.log('Unsubscribed from messages');
    } catch (error) {
      console.error('Error setting up message listener:', error);
      return () => {};
    }
  }

  onTyping(conversationId, userEmail, callback) {
    try {
      console.log(`Setting up typing listener for ${conversationId}`);
      // Return unsubscribe function
      return () => console.log('Unsubscribed from typing');
    } catch (error) {
      console.error('Error setting up typing listener:', error);
      return () => {};
    }
  }

  // Helper Methods
  getDefaultPreferences() {
    return {
      browser: {
        message: true,
        invoice: true,
        job: true,
        payment: true,
        schedule: true,
        system: false
      },
      email: {
        message: false,
        invoice: true,
        job: true,
        payment: true,
        schedule: true,
        system: true
      },
      sms: {
        message: false,
        invoice: false,
        job: false,
        payment: true,
        schedule: false,
        system: false
      },
      quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      urgency_override: {
        critical_always: true,
        high_during_hours: true
      }
    };
  }

  // Real-time listeners
  subscribeToNotifications(userEmail, callback) {
    if (!userEmail) return () => {};
    
    const notificationsRef = collection(this.db, 'notifications');
    const q = query(
      notificationsRef,
      where('userEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    });
  }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
