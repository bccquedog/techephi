# Create Admin User: bblair@techephi.com

## Quick Setup Instructions

The user `bblair@techephi.com` needs to be created in Firebase Authentication before they can sign in.

### Step 1: Create User in Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/project/techephi-crm/authentication/users

2. **Click "Add user"** button (top right)

3. **Enter user details**:
   - **Email**: `bblair@techephi.com`
   - **Password**: `Omega1948`
   - **Password confirmation**: `Omega1948`

4. **Click "Add user"**

### Step 2: Sign In

After creating the user, they can sign in:
- **Email**: `bblair@techephi.com`
- **Password**: `Omega1948`

### What Happens Automatically

When `bblair@techephi.com` signs in for the first time:
- ✅ System recognizes the email as admin (hardcoded in code)
- ✅ Automatically creates user profile in Firestore with `role: 'admin'`
- ✅ Grants full admin dashboard access

### Troubleshooting

**If login fails:**
1. Verify the user exists in Firebase Console > Authentication > Users
2. Check that email is exactly: `bblair@techephi.com` (case-sensitive)
3. Verify password is: `Omega1948`
4. Try using "Forgot Password" to reset if needed

**If user exists but no admin access:**
- The code automatically assigns admin role based on email
- Check browser console for any errors
- User profile will be created automatically on first login
