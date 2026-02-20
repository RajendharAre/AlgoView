# Image-to-Tutorial Mapping Guide

## 📸 Images You Uploaded (9 total)

All images are in: `public/images/tutorials/`

```
AWSCloud.png              → AWS Cloud Deployment Guide
CSSFlexBox.png            → CSS Grid & Flexbox Mastery
DockerContainer.png       → Docker & Containerization
MongoDB.png               → MongoDB & Mongoose Complete Guide
NextJS.png                → Next.js Full-Stack Development
NodeJS.png                → Node.js REST API Development
ReactJS.png               → React Hooks - Complete Guide
TailWindCSS.png           → Tailwind CSS Advanced Techniques
TypeScript.png            → TypeScript for React Developers
```

---

## 📋 Complete Tutorial Mapping

| Image Name | Tutorial Title | Category | Difficulty | Duration |
|-----------|---|---|---|---|
| **ReactJS.png** | React Hooks - Complete Guide | Web | Beginner | 20 min |
| **NodeJS.png** | Node.js REST API Development | Web | Intermediate | 30 min |
| **CSSFlexBox.png** | CSS Grid & Flexbox Mastery | Web | Beginner | 18 min |
| **TypeScript.png** | TypeScript for React Developers | Web | Intermediate | 25 min |
| **DockerContainer.png** | Docker & Containerization | DevOps | Intermediate | 28 min |
| **NextJS.png** | Next.js Full-Stack Development | Web | Advanced | 35 min |
| **TailWindCSS.png** | Tailwind CSS Advanced Techniques | Web | Beginner | 15 min |
| **MongoDB.png** | MongoDB & Mongoose Complete Guide | Web | Intermediate | - |
| **AWSCloud.png** | AWS Cloud Deployment Guide | Cloud | Advanced | - |

---

## 🔗 Firebase URLs Format

Once uploaded to Firebase, your URLs will look like:

```
https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2FReactJS.png?alt=media

https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2FNodeJS.png?alt=media

... and so on
```

---

## ✨ Next Steps

### Option 1: Auto-Organize & Upload (Recommended)

```bash
# Reorganize images into category folders
Move-Item public/images/tutorials/ReactJS.png public/images/tutorials/react/
Move-Item public/images/tutorials/NodeJS.png public/images/tutorials/nodejs/
Move-Item public/images/tutorials/TypeScript.png public/images/tutorials/typescript/
Move-Item public/images/tutorials/CSSFlexBox.png public/images/tutorials/css/
Move-Item public/images/tutorials/NextJS.png public/images/tutorials/nextjs/
Move-Item public/images/tutorials/TailWindCSS.png public/images/tutorials/tailwind/
Move-Item public/images/tutorials/DockerContainer.png public/images/tutorials/docker/
Move-Item public/images/tutorials/MongoDB.png public/images/tutorials/mongodb/
Move-Item public/images/tutorials/AWSCloud.png public/images/tutorials/aws/
```

### Option 2: Keep as-is and Map Directly

Upload all images from `public/images/tutorials/` to Firebase Storage and map URLs.

---

## 📤 Upload to Firebase

### Method 1: Firebase Console
1. Go to https://console.firebase.google.com/
2. Project → Storage
3. Create folders: `tutorials/react/`, `tutorials/nodejs/`, etc.
4. Drag & drop images into folders
5. Copy download URLs

### Method 2: Firebase CLI
```bash
# Upload entire folder
firebase storage:upload public/images/tutorials/ tutorials/ --recursive
```

---

## 🔄 Map URLs to sampleData.js

After uploading, create a mapping file: `firebase-image-mapping.json`

```json
{
  "React Hooks - Complete Guide": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FReactJS.png?alt=media",
  "Node.js REST API Development": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fnodejs%2FNodeJS.png?alt=media",
  "CSS Grid & Flexbox Mastery": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fcss%2FCSSFlexBox.png?alt=media",
  "TypeScript for React Developers": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Ftypescript%2FTypeScript.png?alt=media",
  "Docker & Containerization": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fdocker%2FDockerContainer.png?alt=media",
  "Next.js Full-Stack Development": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fnextjs%2FNextJS.png?alt=media",
  "Tailwind CSS Advanced Techniques": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Ftailwind%2FTailWindCSS.png?alt=media",
  "MongoDB & Mongoose Complete Guide": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fmongodb%2FMongoDB.png?alt=media",
  "AWS Cloud Deployment Guide": "https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Faws%2FAWSCloud.png?alt=media"
}
```

---

## 📝 Manual Update Script

Create: `scripts/apply-image-mapping.js`

```javascript
const fs = require('fs');
const path = require('path');

const mapping = require('../firebase-image-mapping.json');
const sampleDataPath = path.join(__dirname, '../src/utils/sampleData.js');

let content = fs.readFileSync(sampleDataPath, 'utf-8');

// Replace imageUrl for each tutorial
for (const [tutorialTitle, firebaseUrl] of Object.entries(mapping)) {
  // Find the tutorial and replace its imageUrl
  const pattern = new RegExp(
    `(title:\\s*"${escapeRegExp(tutorialTitle)}"[^}]*imageUrl:\\s*)"[^"]*"`,
    's'
  );
  
  content = content.replace(pattern, `$1"${firebaseUrl}"`);
}

fs.writeFileSync(sampleDataPath, content, 'utf-8');
console.log('✅ Updated all tutorial image URLs!');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

Run it:
```bash
node scripts/apply-image-mapping.js
```

---

## ✅ Verification Checklist

- [ ] Images uploaded to Firebase Storage
- [ ] Each image has a Firebase download URL
- [ ] Created `firebase-image-mapping.json`
- [ ] Ran `node scripts/apply-image-mapping.js`
- [ ] Verified sampleData.js has correct URLs
- [ ] All tutorials display images in dev server (`npm run dev`)
- [ ] Built and deployed (`npm run build && firebase deploy`)

---

## 🎯 Summary

**Your 9 images map perfectly to 9 tutorials:**
- ✅ 8 Web development tutorials
- ✅ 1 DevOps tutorial  
- ✅ 1 Cloud tutorial

**All categories covered!** 🚀
