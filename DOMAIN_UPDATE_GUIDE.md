# Domain Update Guide: Vercel → techephi.com

## ✅ Changes Made in Codebase

The following changes have been made in the codebase to support the domain update:

### 1. Mobile App Configuration
- **Updated**: `mobile-app/src/config/constants.ts`
  - Changed `WEBSITE_URL` from `http://localhost:5173` to `https://techephi.com`
  - This ensures the mobile app's home button links to the correct production domain

### 2. Documentation Updates
- **Updated**: `FIREBASE_SETUP_COMPLETE.md` - Updated production URL reference
- **Updated**: `FIREBASE_SETUP_STEPS.md` - Updated verification URL reference

## 🔧 Required Actions Outside of Cursor

### 1. Vercel Dashboard Configuration

You need to configure your custom domain in Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com/brian-proctors-projects/techephi
2. **Navigate to**: Project Settings → Domains
3. **Add Domain**: Add `techephi.com` (and optionally `www.techephi.com`)
4. **DNS Configuration**: Follow Vercel's instructions to update your DNS records:
   - Add an A record or CNAME pointing to Vercel's servers
   - Wait for DNS propagation (can take up to 48 hours, usually much faster)
5. **SSL Certificate**: Vercel will automatically provision an SSL certificate for your domain

### 2. Firebase Console Configuration

You need to authorize your new domain in Firebase Authentication:

1. **Go to Firebase Console**: https://console.firebase.google.com/project/techephi-crm/authentication
2. **Navigate to**: Authentication → Settings → Authorized domains
3. **Add Domain**: Add `techephi.com` to the list of authorized domains
4. **Important**: Keep `localhost` for local development
5. **Also add**: `www.techephi.com` if you plan to use the www subdomain

### 3. Environment Variables (Vercel)

**No changes needed** to environment variables in Vercel. The Firebase `authDomain` should remain as your Firebase project's auth domain (e.g., `techephi-crm.firebaseapp.com`), not your custom domain.

**Important**: 
- `VITE_FIREBASE_AUTH_DOMAIN` should remain as `techephi-crm.firebaseapp.com` (or your Firebase project's auth domain)
- The custom domain (`techephi.com`) is only added to Firebase's authorized domains list, not as the authDomain config value

### 4. DNS Configuration (Domain Registrar)

At your domain registrar (where you purchased techephi.com):

1. **Add DNS Records** as instructed by Vercel:
   - Typically an A record pointing to Vercel's IP addresses, OR
   - A CNAME record pointing to your Vercel deployment URL
2. **Wait for Propagation**: DNS changes can take 24-48 hours to fully propagate

## 📋 Verification Checklist

After completing the above steps:

- [ ] Domain added in Vercel dashboard
- [ ] DNS records updated at domain registrar
- [ ] Domain verified in Vercel (shows as "Valid" in dashboard)
- [ ] `techephi.com` added to Firebase authorized domains
- [ ] SSL certificate provisioned (automatic in Vercel)
- [ ] Test: Visit https://techephi.com and verify the site loads
- [ ] Test: Verify Firebase authentication works on the new domain
- [ ] Test: Mobile app home button links to https://techephi.com

## 🔍 Testing

Once everything is configured:

1. **Test Website**: Visit https://techephi.com
2. **Test Authentication**: Try logging in with your test accounts
3. **Test Mobile App**: Verify the home button opens https://techephi.com
4. **Test Firebase**: Ensure all Firebase operations work correctly

## ⚠️ Important Notes

1. **Firebase authDomain**: This should NOT be changed to `techephi.com`. It must remain as your Firebase project's auth domain (e.g., `techephi-crm.firebaseapp.com`).

2. **Environment Variables**: No code changes needed - Firebase configuration uses environment variables that are already set correctly.

3. **Local Development**: The local development environment will continue to work with `localhost:5173` - no changes needed there.

4. **DNS Propagation**: After updating DNS records, it may take some time for the changes to propagate globally. You can check propagation status using tools like https://dnschecker.org

## 🆘 Troubleshooting

### Domain not resolving
- Check DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Verify domain is added in Vercel dashboard

### Firebase authentication not working
- Verify `techephi.com` is added to Firebase authorized domains
- Check browser console for specific error messages
- Ensure Firebase environment variables are correctly set in Vercel

### SSL certificate issues
- Vercel automatically provisions SSL certificates
- If issues occur, check domain verification status in Vercel
- Ensure DNS records are correctly pointing to Vercel











