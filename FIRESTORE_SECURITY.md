# Firestore Security Rules Documentation

## Security Implementation

The Firestore rules implemented in `firestore.rules` ensure strict data isolation and user privacy:

### Chat Security Rules

```javascript
// Users collection - each user can only access their own data
match /users/{userId} {
  // User can only read/write their own user document
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  // Chats subcollection - each user can only access their own chats
  match /chats/{chatId} {
    // User can only read/write their own chats
    allow read, write: if request.auth != null && request.auth.uid == userId;
    
    // Messages subcollection - each user can only access messages in their own chats
    match /messages/{messageId} {
      // User can only read/write messages in their own chats
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Key Security Features:

1. **User Isolation**: Users can only access data under their own `userId` path
2. **Authentication Required**: All operations require valid Firebase authentication
3. **Path Protection**: Direct access to `/chats` or other collections is denied
4. **Subcollection Security**: Messages are protected under user-specific chat paths
5. **Catch-all Deny**: Any unspecified paths are explicitly denied

### Deployment Instructions:

1. **Deploy Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Test Rules** (optional):
   ```bash
   firebase emulators:start --only firestore
   ```

### Error Handling:

The application gracefully handles security-related errors:
- **Permission Denied**: Shows user-friendly messages and clears relevant UI
- **Unauthenticated**: Redirects to login or shows appropriate messaging
- **Logging**: Context-aware error logging without exposing sensitive data

### Data Structure:

```
users/
  {userId}/
    chats/
      {chatId}/
        title: string
        createdAt: timestamp
        updatedAt: timestamp
        messages/
          {messageId}/
            role: "user" | "assistant"
            content: string
            createdAt: timestamp
```

### Security Best Practices Implemented:

- ✅ **Principle of Least Privilege**: Users only access their own data
- ✅ **Defense in Depth**: Multiple layers of security checks
- ✅ **Explicit Deny**: Default deny policy with explicit allows
- ✅ **Authentication Validation**: All operations require valid auth
- ✅ **Path-based Security**: Security based on document paths
- ✅ **Subcollection Protection**: Nested data properly secured