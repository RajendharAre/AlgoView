# Manual Image Upload to Firebase + Auto-Update sampleData.js

You'll upload images manually, then I'll auto-map the URLs to sampleData.js. Simple! ✅

---

## Step 1: Upload Images to Firebase Storage (Manual)

### Option A: Firebase Web Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click your project → **Storage** → Click folder icon or **Upload file**
3. Create folders:
   ```
   tutorials/
   ├── react/
   ├── javascript/
   ├── python/
   ├── java/
   ├── cpp/
   └── go/
   
   code-examples/
   ├── algorithms/
   ├── system-design/
   └── interview/
   ```
4. Upload your images into respective folders
5. Copy the download URL for each image

### Option B: Firebase CLI (Advanced)

```bash
# List your project
firebase projects:list

# Upload single file
firebase storage:upload public/images/tutorials/react/hooks.jpg tutorials/react/hooks.jpg

# Upload entire folder
firebase storage:upload public/images/ / --recursive
```

---

## Step 2: Get Firebase URLs for Your Images

After uploading, get the CDN URL for each image:

### From Web Console:
1. Click on image in Firebase Storage
2. Click **Copy URL** (top right)
3. Save the URL

### Example Firebase URLs:
```
https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2Fhooks.jpg?alt=media

https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/code-examples%2Fsystem-design%2Flru-cache.jpg?alt=media
```

---

## Step 3: Update sampleData.js with URLs

### Option A: Auto-Map (Recommended)

If you uploaded images with **standard naming**, run:

```bash
npm run map-urls
```

**Menu appears:**
```
📋 Options:

   1️⃣  Auto-map predefined URLs (recommended)
   2️⃣  Create custom URL mapping file
   3️⃣  View current sampleData.js URLs
   4️⃣  Auto-map + Deploy to Firebase

Choose option (1-4): 
```

**Choose option 1** → All placeholder URLs replaced with Firebase URLs ✅

### Option B: Custom Mapping (If you have special URLs)

1. Run:
   ```bash
   npm run map-urls
   Choice: 2
   ```

2. Edit generated `firebase-url-template.json`:
   ```json
   {
     "mappings": {
       "useContext": "YOUR_FIREBASE_URL_1",
       "useMemo": "YOUR_FIREBASE_URL_2",
       "promise": "YOUR_FIREBASE_URL_3",
       ...
     }
   }
   ```

3. Create script to apply custom mappings:
   ```bash
   node scripts/apply-custom-urls.js
   ```

### Option C: Manual (If you prefer to edit directly)

Edit `src/utils/sampleData.js` directly:

**Before:**
```javascript
const tutorials = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    imageUrl: "https://via.placeholder.com/400x200?text=React+Hooks",
    // ...
  }
];
```

**After:**
```javascript
const tutorials = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2Fhooks.jpg?alt=media",
    // ...
  }
];
```

---

## Step 4: Deploy to Production

```bash
# Build
npm run build

# Deploy to Firebase Hosting
firebase deploy

# View live
firebase open hosting
```

---

## Workflow Summary

```
1. Upload images → Firebase Storage (Manual/Web Console)
                  ↓
2. Copy download URLs from Firebase
                  ↓
3. Run: npm run map-urls
                  ↓
4. Choose option 1 (auto-map)
                  ↓
5. sampleData.js updated automatically ✅
                  ↓
6. npm run build && firebase deploy
                  ↓
7. Your images live on production! 🚀
```

---

## Standard Image Naming Convention

For auto-mapping to work best, name your images like:

```
useContext.jpg
useMemo.jpg
useCallback.jpg
useRef.jpg
useAsync.jpg
useEffect.jpg

promises.jpg
async-await.jpg

decorators.jpg
generators.jpg

lru-cache.jpg
rate-limiter.jpg
binary-search.jpg
```

These names will auto-map perfectly! ✅

---

## Getting URLs from Firebase Console

### Visual Steps:

1. **Firebase Console** → Your Project → **Storage**
2. **Navigate to folder** with your image
3. **Click image filename**
4. **Copy "URL"** button appears on right panel
5. **Paste URL** into your mapping

**URL Format:**
```
https://firebasestorage.googleapis.com/v0/b/{PROJECT_ID}.appspot.com/o/{ENCODED_PATH}?alt=media
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| URLs not updating | Check if image URLs are truly placeholders (`via.placeholder.com`) |
| Firebase Storage not showing images | Check `.gitignore` - Firebase rules allow public read ✅ |
| "Cannot read firebase-url-template.json" | Run `npm run map-urls` → Option 2 first to create it |
| Images not loading in dev | Verify Firebase URL is accessible in browser (copy-paste URL) |
| Wrong image in tutorial | Rename image to match expected name or use custom mapping |

---

## Commands Reference

```bash
# View current URLs in sampleData.js
npm run map-urls
# Choice: 3

# Auto-map Firebase URLs to sampleData.js
npm run map-urls
# Choice: 1

# Create custom URL template
npm run map-urls
# Choice: 2

# Auto-map + show deployment steps
npm run map-urls
# Choice: 4
```

---

## That's It! 🎉

Your images are now stored in Firebase Storage + CDN and linked in sampleData.js!

**Next:** Deploy to production with `firebase deploy`
