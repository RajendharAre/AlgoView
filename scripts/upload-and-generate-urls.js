const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Check if service account key exists
const keyPath = path.join(__dirname, '../serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('❌ ERROR: serviceAccountKey.json not found!');
  console.error('   Follow these steps:');
  console.error('   1. Go to https://console.firebase.google.com/');
  console.error('   2. Click your project → Project Settings (gear icon)');
  console.error('   3. Go to Service Accounts tab');
  console.error('   4. Click "Generate New Private Key"');
  console.error('   5. Save as serviceAccountKey.json in project root');
  console.error('   6. Add to .gitignore');
  process.exit(1);
}

const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'algorithm-visualizer.appspot.com'
});

const bucket = admin.storage().bucket();
const projectId = 'algorithm-visualizer';

async function uploadImagesAndGenerateURLs() {
  const imageDir = path.join(__dirname, '../public/images');
  
  // Check if images directory exists
  if (!fs.existsSync(imageDir)) {
    console.error('❌ ERROR: public/images directory not found!');
    console.error('   Create it with: mkdir -p public/images');
    process.exit(1);
  }

  const urlMap = {};

  // Get all images recursively
  const imageFiles = glob.sync('**/*.{jpg,jpeg,png,gif,webp}', {
    cwd: imageDir
  });

  if (imageFiles.length === 0) {
    console.warn('⚠️ WARNING: No images found in public/images/');
    console.warn('   Place your images in public/images/ and try again');
    process.exit(1);
  }

  console.log(`\n🚀 Found ${imageFiles.length} images to upload...\n`);
  console.log('=' .repeat(70));

  let successCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    const localPath = path.join(imageDir, file);
    const remotePath = file.replace(/\\/g, '/'); // Convert Windows paths to forward slashes
    
    try {
      const fileExtension = path.extname(file).slice(1);
      const contentType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

      console.log(`📤 Uploading: ${remotePath}`);
      
      await bucket.upload(localPath, {
        destination: remotePath,
        metadata: {
          contentType: contentType,
          cacheControl: 'public, max-age=86400'
        }
      });

      // Generate download URL
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(remotePath)}?alt=media`;
      
      urlMap[file] = downloadURL;
      console.log(`✅ Success!`);
      console.log(`   📎 URL: ${downloadURL}\n`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error uploading ${remotePath}:`);
      console.error(`   ${error.message}\n`);
      errorCount++;
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('=' .repeat(70));
  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📦 Total: ${imageFiles.length}\n`);

  if (successCount > 0) {
    // Save URLs to JSON file
    const outputPath = path.join(__dirname, '../firebase-urls.json');
    fs.writeFileSync(outputPath, JSON.stringify(urlMap, null, 2));
    
    console.log(`💾 Saved URLs to: firebase-urls.json\n`);
    console.log('📋 Sample URLs (first 3):');
    console.log('=' .repeat(70));
    Object.entries(urlMap).slice(0, 3).forEach(([file, url]) => {
      console.log(`\nFile: ${file}`);
      console.log(`URL: ${url}`);
    });
    console.log('\n' + '=' .repeat(70));
    console.log('\n🎉 Next step: Run `node scripts/update-sample-data.js`\n');
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

uploadImagesAndGenerateURLs().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
