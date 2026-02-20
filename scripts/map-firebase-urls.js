#!/usr/bin/env node

/**
 * Firebase URLs → sampleData.js Mapper
 * 
 * Usage:
 *   npm run map-urls
 * 
 * This script ONLY updates sampleData.js with Firebase URLs
 * (No uploading - images are uploaded manually)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('\n' + '='.repeat(70));
console.log('🔗 Firebase URL Mapper for sampleData.js');
console.log('='.repeat(70));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Predefined Firebase URL mappings
const urlMappings = {
  'useContext': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FuseContext.jpg?alt=media',
  'useMemo': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FuseMemo.jpg?alt=media',
  'useCallback': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FuseCallback.jpg?alt=media',
  'useRef': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FuseRef.jpg?alt=media',
  'useAsync': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FuseAsync.jpg?alt=media',
  'useEffect': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Freact%2FuseEffect.jpg?alt=media',
  'promises': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fjavascript%2Fpromises.jpg?alt=media',
  'async-await': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fjavascript%2Fasync-await.jpg?alt=media',
  'decorators': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fpython%2Fdecorators.jpg?alt=media',
  'generators': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/tutorials%2Fpython%2Fgenerators.jpg?alt=media',
  'lru-cache': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/code-examples%2Fsystem-design%2Flru-cache.jpg?alt=media',
  'rate-limiter': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/code-examples%2Fsystem-design%2Frate-limiter.jpg?alt=media',
  'binary-search': 'https://firebasestorage.googleapis.com/v0/b/algorithm-visualizer-b963c.appspot.com/o/code-examples%2Falgorithms%2Fbinary-search.jpg?alt=media',
};

function showOptions() {
  console.log('\n📋 Options:\n');
  console.log('   1️⃣  Auto-map predefined URLs (recommended)');
  console.log('   2️⃣  Create custom URL mapping file');
  console.log('   3️⃣  View current sampleData.js URLs');
  console.log('   4️⃣  Auto-map + Deploy to Firebase\n');
}

function showMenu() {
  rl.question('Choose option (1-4): ', (choice) => {
    switch(choice.trim()) {
      case '1':
        autoMapPredefinedURLs();
        break;
      case '2':
        createCustomMapping();
        break;
      case '3':
        viewCurrentURLs();
        break;
      case '4':
        autoMapAndDeploy();
        break;
      default:
        console.log('❌ Invalid choice');
        showMenu();
    }
  });
}

function autoMapPredefinedURLs() {
  console.log('\n🔄 Auto-mapping predefined URLs...\n');
  
  const sampleDataPath = path.join(__dirname, '../src/utils/sampleData.js');
  
  if (!fs.existsSync(sampleDataPath)) {
    console.error('❌ sampleData.js not found!');
    rl.close();
    return;
  }

  let content = fs.readFileSync(sampleDataPath, 'utf-8');
  const originalContent = content;
  let replacementCount = 0;

  // Replace placeholder URLs with Firebase URLs
  const placeholderPattern = /https:\/\/via\.placeholder\.com\/[^"']*/g;
  const placeholders = content.match(placeholderPattern) || [];

  if (placeholders.length === 0) {
    console.log('⚠️ No placeholder URLs found in sampleData.js');
    console.log('   Your URLs might already be custom URLs\n');
    showURLSummary();
    askContinue();
    return;
  }

  console.log(`Found ${placeholders.length} placeholder URLs\n`);

  // Get Firebase URLs
  const firebaseUrls = Object.values(urlMappings);
  let urlIndex = 0;

  content = content.replace(placeholderPattern, () => {
    if (urlIndex < firebaseUrls.length) {
      replacementCount++;
      return firebaseUrls[urlIndex++];
    }
    return arguments[0];
  });

  if (content !== originalContent) {
    fs.writeFileSync(sampleDataPath, content, 'utf-8');
    console.log(`✅ Updated ${replacementCount} URLs in sampleData.js\n`);
    console.log(`📊 Summary:`);
    console.log(`   ✅ Total URLs: ${replacementCount}`);
    console.log(`   📦 Firebase URLs used: ${firebaseUrls.length}\n`);
    showURLSummary();
  } else {
    console.log('❌ No changes made to sampleData.js');
  }

  askContinue();
}

function createCustomMapping() {
  console.log('\n📝 Creating custom URL mapping file...\n');
  
  const templatePath = path.join(__dirname, '../firebase-url-template.json');
  
  const template = {
    "description": "Firebase URL mappings for sampleData.js",
    "instructions": "Replace URLs below with your actual Firebase Storage URLs",
    "example_firebase_url": "https://firebasestorage.googleapis.com/v0/b/PROJECT_ID.appspot.com/o/tutorials%2Freact%2Fimage.jpg?alt=media",
    "mappings": {
      "useContext": "https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT.appspot.com/o/your-image-url",
      "useMemo": "https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT.appspot.com/o/your-image-url",
      "promises": "https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT.appspot.com/o/your-image-url"
    }
  };

  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
  console.log(`✅ Created: firebase-url-template.json`);
  console.log(`\n📋 Steps to use custom mapping:`);
  console.log(`   1. Edit firebase-url-template.json with your Firebase URLs`);
  console.log(`   2. Replace all URLs under "mappings"`);
  console.log(`   3. Run: npm run apply-custom-urls\n`);
  
  askContinue();
}

function viewCurrentURLs() {
  console.log('\n🔍 Current URLs in sampleData.js:\n');
  
  const sampleDataPath = path.join(__dirname, '../src/utils/sampleData.js');
  const content = fs.readFileSync(sampleDataPath, 'utf-8');

  // Extract all imageUrl values
  const imageUrlPattern = /imageUrl:\s*"([^"]+)"/g;
  const matches = content.matchAll(imageUrlPattern);
  
  let count = 0;
  for (const match of matches) {
    count++;
    const url = match[1];
    const type = url.includes('via.placeholder') ? '📌 Placeholder' : '✅ Custom';
    console.log(`${count}. ${type}`);
    console.log(`   ${url.substring(0, 90)}${url.length > 90 ? '...' : ''}\n`);
  }

  console.log(`📊 Total: ${count} URLs\n`);
  askContinue();
}

function autoMapAndDeploy() {
  console.log('\n🚀 Auto-mapping URLs and preparing deployment...\n');
  
  // First auto-map
  const sampleDataPath = path.join(__dirname, '../src/utils/sampleData.js');
  let content = fs.readFileSync(sampleDataPath, 'utf-8');
  
  const placeholderPattern = /https:\/\/via\.placeholder\.com\/[^"']*/g;
  const firebaseUrls = Object.values(urlMappings);
  let urlIndex = 0;
  let replacementCount = 0;

  content = content.replace(placeholderPattern, () => {
    if (urlIndex < firebaseUrls.length) {
      replacementCount++;
      return firebaseUrls[urlIndex++];
    }
    return arguments[0];
  });

  fs.writeFileSync(sampleDataPath, content, 'utf-8');
  
  console.log(`✅ Updated ${replacementCount} URLs\n`);
  console.log(`\n📋 Next steps for deployment:\n`);
  console.log(`   1. Build project:`);
  console.log(`      npm run build\n`);
  console.log(`   2. Deploy to Firebase:`);
  console.log(`      firebase deploy\n`);
  console.log(`   3. Verify images on production:\n`);
  console.log(`      Your Firebase Hosting URL\n`);

  askContinue();
}

function showURLSummary() {
  console.log(`📌 Predefined Firebase URLs (${Object.keys(urlMappings).length}):\n`);
  Object.entries(urlMappings).slice(0, 5).forEach(([key, url]) => {
    console.log(`   • ${key}`);
    console.log(`     → ${url.substring(0, 80)}...\n`);
  });
  if (Object.keys(urlMappings).length > 5) {
    console.log(`   ... and ${Object.keys(urlMappings).length - 5} more\n`);
  }
}

function askContinue() {
  rl.question('\n📍 Continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      showOptions();
      showMenu();
    } else {
      console.log('\n✅ Done! Your sampleData.js is ready.\n');
      rl.close();
    }
  });
}

// Start
showOptions();
showMenu();
