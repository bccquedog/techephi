# Admin User Setup Instructions

## Adding bblair@techephi.com as Super Admin

The code has been updated to recognize `bblair@techephi.com` as an admin user. Follow these steps to create the user:

### Step 1: Create User in Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/project/techephi-crm/authentication/users)
2. Click **"Add user"** button
3. Enter the following:
   - **Email**: `bblair@techephi.com`
   - **Password**: `Omega1948`
4. Click **"Add user"**

### Step 2: User Profile Will Be Created Automatically

When the user signs in for the first time, the system will automatically:
- Create a user profile in Firestore (`userProfiles` collection)
- Set the role to `admin` based on the email address
- Grant full admin access

### Step 3: Verify Admin Access

1. Sign in with:
   - Email: `bblair@techephi.com`
   - Password: `Omega1948`
2. You should see the admin dashboard with full access

## Code Changes Made

- Updated `determineRole()` function to recognize `bblair@techephi.com` as admin
- Added automatic user profile creation on first login
- User will have admin role automatically assigned

## Notes

- The user profile is created automatically on first login
- No manual Firestore setup is required
- The email `bblair@techephi.com` is hardcoded as an admin email in the system
