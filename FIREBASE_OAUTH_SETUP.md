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
   - Your production domain (e.g., your-app.firebaseapp.com)

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

1. **Check Firebase Configuration:**
   - In Firebase Console, go to Authentication > Sign-in method
   - Click on GitHub provider
   - Verify the Client ID and Client Secret match what's in GitHub
   - Ensure the authorized domains include:
     - localhost
     - 127.0.0.1
     - localhost:5173
     - Your production domain (algorithm-visualizer-b963c.firebaseapp.com)

2. **Check GitHub Configuration:**
   - In GitHub Developer Settings > OAuth Apps
   - Ensure the Authorization callback URL exactly matches one of these:
     - For development: `http://localhost:5173/__/auth/handler`
     - For development alternative: `http://127.0.0.1:5173/__/auth/handler`
     - For production: `https://algorithm-visualizer-b963c.firebaseapp.com/__/auth/handler`

3. **Common Issues:**
   - Port mismatch: Ensure the port in the callback URL matches your development server port (usually 5173 for Vite)
   - Protocol mismatch: Use `http://` for localhost development, `https://` for production
   - Trailing slashes: Ensure the callback URL ends with `/__/auth/handler`
   - Exact match required: GitHub requires an exact match of the callback URL, including protocol and port

4. **Development Server Port:**
   - Make sure your development server is running on port 5173 (default for Vite)
   - If using a different port, update the callback URL in GitHub accordingly

5. **Multiple Callback URLs:**
   - GitHub allows multiple callback URLs - add both localhost and 127.0.0.1 versions
   - Separate multiple URLs with commas or add them one per line depending on GitHub's interface

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
- localhost:5173 (or your development server port)

## Production Deployment

When deploying to production, add your production domain to the authorized domains list.