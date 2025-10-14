# Firebase OAuth Setup Guide

To enable Google and GitHub authentication, you need to configure OAuth providers in the Firebase Console.

## Google Authentication Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Authentication" > "Sign-in method"
4. Enable "Google" provider
5. Add the following authorized domains:
   - localhost (for development)
   - 127.0.0.1 (for development)
   - localhost:5175 (for development)
   - Your production domain (e.g., algorithm-visualizer-b963c.firebaseapp.com)

## GitHub Authentication Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Authentication" > "Sign-in method"
4. Enable "GitHub" provider
5. You'll need to:
   - Register your application on GitHub:
     - Go to GitHub Settings > Developer settings > OAuth Apps
     - Click "New OAuth App"
     - Set Homepage URL to your Firebase project URL (e.g., https://algorithm-visualizer-b963c.firebaseapp.com)
     - Set Authorization callback URL to: `https://algorithm-visualizer-b963c.firebaseapp.com/__/auth/handler`
   - Copy the Client ID and Client Secret from GitHub to Firebase

### GitHub OAuth Redirect URI Troubleshooting

If you're getting "The redirect_uri is not associated with this application" error:

1. **Important Note About GitHub OAuth:**
   - GitHub OAuth apps only accept a **single** callback URL
   - Unlike other OAuth providers, you cannot specify multiple callback URLs
   - For Firebase authentication to work in both development and production, you must use the Firebase redirect URL

2. **Check Firebase Configuration:**
   - In Firebase Console, go to Authentication > Sign-in method
   - Click on GitHub provider
   - Verify the Client ID and Client Secret match what's in GitHub
   - Ensure the authorized domains include:
     - localhost
     - 127.0.0.1
     - localhost:5175
     - Your production domain (algorithm-visualizer-b963c.firebaseapp.com)

3. **Understanding the Flow:**
   - Firebase handles the OAuth flow for both development and production
   - When you sign in with GitHub, Firebase redirects to its own handler
   - Firebase then redirects back to your application
   - This is why you only need to specify the Firebase callback URL in GitHub

4. **Development Server Port:**
   - Your development server is now configured to run on port 5175
   - Firebase authentication works regardless of the local port because Firebase handles the redirect

5. **Common Issues:**
   - Make sure your Firebase authorized domains include your development domains
   - Ensure the Client ID and Secret in Firebase match those in GitHub
   - The callback URL in GitHub must be exactly: `https://algorithm-visualizer-b963c.firebaseapp.com/__/auth/handler`

## Common Issues and Solutions

### "auth/unauthorized-domain"
- Solution: Add your domain to the authorized domains list in Firebase Authentication settings

### "auth/operation-not-allowed"
- Solution: Make sure the provider is enabled in Firebase Authentication sign-in methods

### "Popup blocked"
- Solution: Allow popups for your site in browser settings

### "auth/account-exists-with-different-credential"
- Solution: User must sign in with their original authentication method

## Testing in Development

For local development, ensure these domains are added to authorized domains:
- localhost
- 127.0.0.1
- localhost:5175

## Production Deployment

When deploying to production, add your production domain to the authorized domains list.