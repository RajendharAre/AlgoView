/**
 * Script to set up CORS configuration for Firebase Storage
 * This script is for documentation purposes - CORS must be configured manually in Firebase Console
 */

console.log(`
FIREBASE STORAGE SETUP INSTRUCTIONS:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: algorithm-visualizer-b963c
3. Navigate to Storage section
4. Click "Get Started" to enable Firebase Storage
5. Follow the prompts to create your default storage bucket

CORS CONFIGURATION (for manual setup):
-------------------------------------
Create a cors.json file with the following content:

[
  {
    "origin": ["http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  },
  {
    "origin": ["http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]

Then run the following commands in your terminal:

gsutil cors set cors.json gs://YOUR_PROJECT_ID.appspot.com

Where YOUR_PROJECT_ID is your actual Firebase project ID.

For development, you can temporarily allow all origins (NOT recommended for production):

[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]

STORAGE RULES DEPLOYMENT:
-------------------------
Once Storage is enabled in the console, run:
firebase deploy --only storage

This will deploy the storage.rules file created in your project.
`);