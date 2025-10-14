# GitHub OAuth App Setup - Correct Configuration

## Important Clarification About GitHub OAuth Callback URLs

After reviewing GitHub's official documentation, it's important to clarify that **GitHub OAuth apps only accept a single callback URL**, not multiple URLs like some other OAuth providers.

## How Firebase OAuth Actually Works

Firebase Authentication handles the OAuth flow differently than you might expect:

### The Correct Flow:
1. User clicks "Sign in with GitHub" in your app
2. Firebase redirects user to GitHub's OAuth endpoint
3. GitHub redirects back to Firebase's handler (the callback URL you specify)
4. Firebase processes the authentication and redirects back to your app

### Why Only One Callback URL:
- The callback URL in GitHub should point to Firebase's auth handler
- Firebase then handles redirecting back to your actual application
- This works for both development and production environments

## Correct GitHub OAuth Configuration

### Authorization Callback URL:
```
https://algorithm-visualizer-b963c.firebaseapp.com/__/auth/handler
```

### Visual Example:
```
Authorization callback URL:
┌─────────────────────────────────────────────────────────────────┐
│ https://algorithm-visualizer-b963c.firebaseapp.com/__/auth/handler│
└─────────────────────────────────────────────────────────────────┘
```

## Why This Works for Both Environments

Firebase Authentication is designed to handle OAuth redirects for multiple environments:

1. **Development**: When you're running on localhost:5175, Firebase still uses the same callback URL
2. **Production**: When deployed, the same callback URL works
3. **Cross-environment**: Firebase handles the routing back to the correct origin

## Required Firebase Configuration

In addition to the GitHub OAuth app, you must also configure Firebase properly:

### Authorized Domains in Firebase:
- localhost
- 127.0.0.1
- localhost:5175
- algorithm-visualizer-b963c.firebaseapp.com

## Common Misconceptions

❌ **Wrong**: Trying to add multiple callback URLs to GitHub OAuth app
❌ **Wrong**: Using localhost URLs directly in GitHub callback URL
✅ **Right**: Using Firebase's auth handler URL in GitHub
✅ **Right**: Configuring authorized domains in Firebase for all environments

This approach ensures your OAuth flow works correctly in all environments without needing multiple callback URLs.