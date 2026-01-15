/**
 * Script to create an admin user in Firebase
 * 
 * INSTRUCTIONS:
 * 
 * Option 1: Use Firebase Console (Recommended)
 * 1. Go to https://console.firebase.google.com/project/techephi-crm/authentication/users
 * 2. Click "Add user"
 * 3. Email: bblair@techephi.com
 * 4. Password: Omega1911
 * 5. Click "Add user"
 * 6. After user is created, go to Firestore Database
 * 7. Navigate to "userProfiles" collection
 * 8. Create a document with the user's UID (from Authentication)
 * 9. Set these fields:
 *    - email: "bblair@techephi.com"
 *    - displayName: "bblair"
 *    - role: "admin"
 *    - createdAt: (current timestamp)
 * 
 * Option 2: Run this script (requires Firebase credentials)
 * Run: node scripts/create-admin-user.js
 * 
 * The code has been updated to recognize bblair@techephi.com as admin,
 * so once the user is created in Firebase Auth, they will have admin access.
 */

// This script can be run if you have Firebase Admin SDK set up
// For now, use Option 1 (Firebase Console) as it's simpler

const email = 'bblair@techephi.com';
const password = 'Omega1911';

async function createAdminUser() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log(`Creating user: ${email}`);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ User created in Firebase Auth: ${user.uid}`);
    
    // Update display name
    await updateProfile(user, {
      displayName: 'bblair'
    });
    
    // Create user profile in Firestore with admin role
    const profileRef = doc(db, 'userProfiles', user.uid);
    await setDoc(profileRef, {
      email: email,
      displayName: 'bblair',
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ User profile created in Firestore with admin role`);
    console.log(`\n✅ Success! Admin user created:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);
    console.log(`   UID: ${user.uid}`);
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User ${email} already exists in Firebase Auth`);
      console.log('   Updating Firestore profile to admin role...');
      
      // User exists, just update the profile
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      // We need to get the user UID - try to sign in first
      const auth = getAuth(app);
      try {
        // Sign in to get the user
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile
        const profileRef = doc(db, 'userProfiles', user.uid);
        await setDoc(profileRef, {
          email: email,
          displayName: 'bblair',
          role: 'admin',
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log(`✅ User profile updated to admin role`);
        console.log(`   Email: ${email}`);
        console.log(`   Role: admin`);
        console.log(`   UID: ${user.uid}`);
        
        // Sign out
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        
        process.exit(0);
      } catch (signInError) {
        console.error('❌ Error signing in to update profile:', signInError.message);
        console.log('\n📝 Manual steps required:');
        console.log('1. Sign in to Firebase Console');
        console.log('2. Go to Authentication > Users');
        console.log('3. Find or create user: bblair@techephi.com');
        console.log('4. Go to Firestore > userProfiles collection');
        console.log('5. Create/update document with user UID');
        console.log('6. Set role field to "admin"');
        process.exit(1);
      }
    } else {
      console.error('❌ Error creating admin user:', error.message);
      console.error('Full error:', error);
      process.exit(1);
    }
  }
}

createAdminUser();
