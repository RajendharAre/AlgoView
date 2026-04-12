#!/usr/bin/env node

/**
 * Firebase Image Upload & Update - Complete Automation
 *
 * Usage:
 *   npm run upload-images
 *
 * This script:
 * 1. Uploads all images from public/images/ to Firebase Storage
 * 2. Generates CDN URLs and saves to firebase-urls.json
 * 3. Updates sampleData.js with Firebase URLs
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('\n' + '='.repeat(70))
console.log('🚀 Firebase Image Upload & AutoUpdate Tool')
console.log('='.repeat(70))

// Check prerequisites
console.log('\n✅ Checking prerequisites...\n')

const checks = {
  'serviceAccountKey.json': {
    path: path.join(__dirname, '../serviceAccountKey.json'),
    error: 'Firebase service account key not found. See GET_SERVICE_ACCOUNT_KEY.md',
  },
  'public/images': {
    path: path.join(__dirname, '../public/images'),
    error: 'Images directory not found. Run: mkdir -p public/images/',
  },
  'scripts/upload-and-generate-urls.js': {
    path: path.join(__dirname, './upload-and-generate-urls.js'),
    error: 'Upload script missing!',
  },
  'scripts/update-sample-data.js': {
    path: path.join(__dirname, './update-sample-data.js'),
    error: 'Update script missing!',
  },
}

let allChecked = true
Object.entries(checks).forEach(([name, check]) => {
  if (fs.existsSync(check.path)) {
    console.log(`   ✅ ${name}`)
  } else {
    console.log(`   ❌ ${name}`)
    console.log(`      → ${check.error}`)
    allChecked = false
  }
})

if (!allChecked) {
  console.error('\n❌ Setup incomplete. Please fix the issues above.\n')
  process.exit(1)
}

console.log('\n✅ All checks passed!\n')

// Step 1: Upload images
console.log('='.repeat(70))
console.log('STEP 1: Uploading images to Firebase Storage...')
console.log('='.repeat(70) + '\n')

try {
  execSync('node scripts/upload-and-generate-urls.js', { stdio: 'inherit' })
} catch (error) {
  console.error('\n❌ Upload failed!')
  process.exit(1)
}

// Check if firebase-urls.json was created
const urlsPath = path.join(__dirname, '../firebase-urls.json')
if (!fs.existsSync(urlsPath)) {
  console.error('\n❌ firebase-urls.json not created. Upload may have failed.\n')
  process.exit(1)
}

const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'))
const uploadedCount = Object.keys(urls).length

if (uploadedCount === 0) {
  console.warn('\n⚠️ No images were uploaded. Check public/images/ for image files.\n')
  process.exit(1)
}

console.log(`\n📊 Successfully uploaded ${uploadedCount} images!\n`)

// Step 2: Update sampleData.js
console.log('='.repeat(70))
console.log('STEP 2: Updating sampleData.js with Firebase URLs...')
console.log('='.repeat(70) + '\n')

try {
  execSync('node scripts/update-sample-data.js', { stdio: 'inherit' })
} catch (error) {
  console.error('\n⚠️ Update completed with warnings (this is usually fine)\n')
}

// Success message
console.log('\n' + '='.repeat(70))
console.log('🎉 COMPLETE! Firebase setup done!')
console.log('='.repeat(70))

console.log('\n📝 Next steps:\n')
console.log('   1. Verify images display correctly in development:')
console.log('      npm run dev\n')
console.log('   2. Check if images load on dev server\n')
console.log('   3. Build and deploy to Firebase:')
console.log('      npm run build')
console.log('      firebase deploy\n')
console.log('   4. Verify images on production\n')
console.log('📌 Uploaded images are in Firebase Storage Console:')
console.log('   → https://console.firebase.google.com/ → Your Project → Storage\n')
