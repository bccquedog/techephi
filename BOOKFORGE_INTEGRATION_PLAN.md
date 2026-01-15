# Book Forge Integration Plan: techephi.com/bookforge

## 📋 Current State Analysis

### Tech ePhi CRM (Main App)
- **Location**: `/Users/brianproctor/tech/`
- **Framework**: React + Vite
- **Deployment**: Vercel at `techephi.com`
- **Routing**: Client-side routing (no React Router currently visible)
- **Structure**: Single-page application with view state management

### Book Forge App
- **Location**: Separate Vercel deployment
- **URL**: `https://bookforge-tan.vercel.app/`
- **Framework**: Appears to be a React/Next.js application
- **Features**: Book formatting tool (PDF, EPUB, DOCX generation)
- **Status**: Independent deployment

## 🎯 Integration Options

### Option 1: Vercel Path Rewrites (Recommended for Quick Integration)
**Approach**: Keep Book Forge as separate Vercel project, proxy `/bookforge` path

**Pros:**
- ✅ Minimal code changes to Tech ePhi
- ✅ Book Forge remains independently deployable
- ✅ Easy to rollback
- ✅ Separate scaling and monitoring
- ✅ No need to merge codebases

**Cons:**
- ⚠️ Requires Vercel configuration
- ⚠️ Potential CORS issues if Book Forge makes external API calls
- ⚠️ Cookie/session management complexity
- ⚠️ Slight latency overhead

**Implementation:**
1. Create `vercel.json` in Tech ePhi root
2. Configure rewrite rules to proxy `/bookforge/*` to Book Forge deployment
3. Update Book Forge base path configuration if needed

---

### Option 2: Monorepo Integration (Recommended for Long-term)
**Approach**: Add Book Forge as subdirectory, integrate into Tech ePhi routing

**Pros:**
- ✅ Single deployment
- ✅ Shared authentication (if desired)
- ✅ Unified codebase
- ✅ Better performance (no proxy overhead)
- ✅ Easier to share components/utilities

**Cons:**
- ⚠️ Requires merging Book Forge codebase
- ⚠️ More complex build process
- ⚠️ Coupled deployments
- ⚠️ Larger codebase to maintain

**Implementation:**
1. Clone/copy Book Forge into `apps/bookforge/` or `bookforge/`
2. Add React Router to Tech ePhi
3. Configure route at `/bookforge`
4. Update build configuration
5. Handle shared dependencies

---

### Option 3: Subdomain Approach
**Approach**: Deploy Book Forge at `bookforge.techephi.com`

**Pros:**
- ✅ Clean separation
- ✅ No routing complexity
- ✅ Independent deployments
- ✅ Easy to configure in Vercel

**Cons:**
- ⚠️ Different URL structure (`bookforge.techephi.com` vs `techephi.com/bookforge`)
- ⚠️ Requires DNS configuration
- ⚠️ Potential cookie domain issues

**Implementation:**
1. Add subdomain in Vercel
2. Point Book Forge deployment to subdomain
3. Update any internal links

---

### Option 4: Iframe Embed
**Approach**: Embed Book Forge in an iframe at `/bookforge` route

**Pros:**
- ✅ Simplest implementation
- ✅ No code merging needed
- ✅ Quick to implement

**Cons:**
- ⚠️ Poor mobile experience
- ⚠️ SEO limitations
- ⚠️ Navigation complexity
- ⚠️ Security considerations
- ⚠️ Limited integration capabilities

**Implementation:**
1. Add route in Tech ePhi App.jsx
2. Create component that renders iframe
3. Handle navigation and messaging

---

## 🏆 Recommended Approach: **Option 1 (Vercel Path Rewrites)**

**Rationale:**
- Fastest to implement
- Maintains separation of concerns
- Allows independent development and deployment
- Can migrate to Option 2 later if needed
- Minimal risk to existing Tech ePhi app

## 📝 Implementation Plan: Option 1 (Vercel Path Rewrites)

### Phase 1: Vercel Configuration

1. **Create `vercel.json` in Tech ePhi root:**
```json
{
  "rewrites": [
    {
      "source": "/bookforge/:path*",
      "destination": "https://bookforge-tan.vercel.app/:path*"
    }
  ],
  "headers": [
    {
      "source": "/bookforge/:path*",
      "headers": [
        {
          "key": "X-Forwarded-Host",
          "value": "techephi.com"
        },
        {
          "key": "X-Forwarded-Proto",
          "value": "https"
        }
      ]
    }
  ]
}
```

2. **Update Book Forge Configuration (if needed):**
   - Check if Book Forge uses absolute paths
   - May need to configure base path in Book Forge
   - Update any hardcoded URLs

### Phase 2: Tech ePhi Integration

1. **Add Navigation Link:**
   - Add "Book Forge" to sidebar/navigation in `src/App.jsx`
   - Link to `/bookforge`

2. **Handle Routing:**
   - Ensure Tech ePhi doesn't intercept `/bookforge` routes
   - May need to exclude from client-side routing

### Phase 3: Testing

1. **Local Testing:**
   - Test with Vercel CLI: `vercel dev`
   - Verify rewrite rules work

2. **Production Testing:**
   - Deploy to Vercel
   - Test `techephi.com/bookforge`
   - Verify all Book Forge features work
   - Check authentication (if Book Forge has auth)

### Phase 4: Authentication Integration (Optional)

If Book Forge needs authentication:
1. **Shared Auth Options:**
   - Use Firebase Auth (if Book Forge supports it)
   - Pass auth tokens via headers/cookies
   - Implement SSO between apps

2. **Independent Auth:**
   - Keep Book Forge auth separate
   - Add login redirect from Tech ePhi if needed

## 🔄 Alternative: Migration Path to Option 2

If you want to migrate to monorepo later:

1. **Preparation:**
   - Ensure Book Forge codebase is accessible
   - Document Book Forge dependencies
   - Identify shared utilities

2. **Integration Steps:**
   - Add `apps/bookforge/` directory
   - Copy Book Forge code
   - Install dependencies
   - Configure React Router in Tech ePhi
   - Update build scripts
   - Test integration

3. **Build Configuration:**
   - Update `vite.config.js` for multi-app setup
   - Configure path aliases
   - Handle shared dependencies

## ⚠️ Considerations

### Technical Considerations
- **CORS**: Book Forge may need CORS headers if making API calls
- **Cookies**: Session management across proxy
- **Assets**: Static assets may need path adjustments
- **Environment Variables**: Book Forge env vars in Vercel
- **Build Process**: Ensure Book Forge builds correctly

### User Experience
- **Navigation**: Seamless transition between apps
- **Loading**: Initial load time for Book Forge
- **Mobile**: Ensure responsive design works
- **Browser History**: Back/forward button behavior

### Business Considerations
- **Analytics**: Track usage separately or combined
- **Monitoring**: Separate error tracking
- **Deployment**: Independent vs. coupled releases
- **Cost**: Vercel pricing for multiple deployments

## 📊 Decision Matrix

| Factor | Option 1 (Proxy) | Option 2 (Monorepo) | Option 3 (Subdomain) | Option 4 (Iframe) |
|--------|------------------|---------------------|----------------------|-------------------|
| Implementation Time | ⭐⭐⭐ Fast | ⭐ Slow | ⭐⭐ Medium | ⭐⭐⭐ Very Fast |
| Maintenance | ⭐⭐⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Easy | ⭐⭐ Medium |
| Performance | ⭐⭐ Good | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent | ⭐ Poor |
| Flexibility | ⭐⭐⭐ High | ⭐⭐ Medium | ⭐⭐⭐ High | ⭐ Low |
| User Experience | ⭐⭐⭐ Good | ⭐⭐⭐ Excellent | ⭐⭐ Good | ⭐ Poor |
| SEO | ⭐⭐⭐ Good | ⭐⭐⭐ Excellent | ⭐⭐ Good | ⭐ Poor |

## 🚀 Next Steps

1. **Decision**: Choose integration approach
2. **Access**: Ensure access to Book Forge codebase/repository
3. **Configuration**: Set up Vercel rewrites (if Option 1)
4. **Testing**: Test locally and in staging
5. **Deployment**: Deploy to production
6. **Monitoring**: Monitor performance and errors
7. **Documentation**: Update project docs

## 📚 Additional Resources

- [Vercel Rewrites Documentation](https://vercel.com/docs/configuration/routing/rewrites)
- [Vercel Headers Documentation](https://vercel.com/docs/configuration/routing/headers)
- React Router documentation (if choosing Option 2)

---

**Status**: Planning Phase  
**Last Updated**: 2024  
**Next Review**: After approach selection










