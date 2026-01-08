# Deployment Guide

Your PlacementOS AI application is ready to deploy! Here are the steps for different platforms:

## Prerequisites

Make sure you have:
1. ✅ All environment variables set in `.env.local`
2. ✅ Firebase project configured
3. ✅ Gemini API key

## Required Environment Variables

Add these to your deployment platform's environment variables:

```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables**:
   - Go to your project on [vercel.com](https://vercel.com)
   - Navigate to Settings → Environment Variables
   - Add all the environment variables listed above

4. **Redeploy** after adding environment variables

**Or use the web interface:**
- Push your code to GitHub
- Import the repository on [vercel.com](https://vercel.com)
- Add environment variables in project settings
- Deploy!

### Option 2: Deploy to Netlify

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Add Environment Variables**:
   - Go to your site on [netlify.com](https://netlify.com)
   - Navigate to Site settings → Environment variables
   - Add all the environment variables listed above

**Or use the web interface:**
- Push your code to GitHub
- Import the repository on [netlify.com](https://netlify.com)
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in site settings

### Option 3: Deploy to Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm i -g firebase-tools
   ```

2. **Login and Initialize**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**:
   - Public directory: `dist`
   - Single-page app: Yes
   - Set up automatic builds: No (or Yes if using GitHub)

4. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

**Note:** For Firebase Hosting, you'll need to configure environment variables differently since it's a static host. Consider using Firebase Functions for server-side environment variables, or use a client-side config approach.

### Option 4: Deploy to GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

**Note:** GitHub Pages doesn't support server-side environment variables. You'll need to use a different approach for sensitive keys.

## Local Testing

Before deploying, test locally:

```bash
# Development server
npm run dev

# Production build preview
npm run build
npm run preview
```

## Troubleshooting

- **Build fails**: Check that all dependencies are installed with `npm install --legacy-peer-deps`
- **Environment variables not working**: Make sure they're prefixed with `VITE_` for client-side access
- **Firebase errors**: Verify your Firebase configuration and Firestore security rules
- **Large bundle size**: Consider code splitting (warning shown during build)

## Post-Deployment

After deployment:
1. ✅ Test all features (authentication, Firebase operations)
2. ✅ Verify environment variables are set correctly
3. ✅ Check Firebase security rules
4. ✅ Monitor error logs on your hosting platform

---

**Your app is built and ready!** The production build is in the `dist` folder.
