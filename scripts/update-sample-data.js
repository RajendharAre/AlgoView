const fs = require('fs');
const path = require('path');

// Check if firebase-urls.json exists
const urlsPath = path.join(__dirname, '../firebase-urls.json');
if (!fs.existsSync(urlsPath)) {
  console.error('❌ ERROR: firebase-urls.json not found!');
  console.error('   Run this first: node scripts/upload-and-generate-urls.js');
  process.exit(1);
}

const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'));
const sampleDataPath = path.join(__dirname, '../src/utils/sampleData.js');

if (!fs.existsSync(sampleDataPath)) {
  console.error('❌ ERROR: src/utils/sampleData.js not found!');
  process.exit(1);
}

// Read current sampleData.js
let content = fs.readFileSync(sampleDataPath, 'utf-8');
const originalContent = content;

// Create mapping of placeholder patterns to Firebase URLs
// This matches placeholder URLs like: https://via.placeholder.com/400x200?text=....
const placeholderPattern = /https:\/\/via\.placeholder\.com\/[^"']*/g;
let replacementCount = 0;

// Get all placeholder URLs from sampleData
const placeholders = content.match(placeholderPattern) || [];
console.log(`\n📊 Found ${placeholders.length} placeholder URLs in sampleData.js\n`);

// Replace each placeholder with first available Firebase URL
const availableUrls = Object.values(urls);
let urlIndex = 0;

if (availableUrls.length === 0) {
  console.error('❌ ERROR: No Firebase URLs found in firebase-urls.json');
  process.exit(1);
}

// Replace placeholders intelligently
content = content.replace(placeholderPattern, () => {
  if (urlIndex < availableUrls.length) {
    replacementCount++;
    return availableUrls[urlIndex++];
  }
  return arguments[0];
});

// Check if anything was replaced
if (replacementCount === 0) {
  console.warn('⚠️ WARNING: No placeholder URLs found to replace!');
  console.warn('   Your sampleData.js might already use custom URLs');
  console.log('\n📋 Available Firebase URLs:');
  Object.entries(urls).forEach(([file, url], index) => {
    if (index < 5) {
      console.log(`   ${file}`);
      console.log(`   → ${url}\n`);
    }
  });
  if (Object.entries(urls).length > 5) {
    console.log(`   ... and ${Object.entries(urls).length - 5} more\n`);
  }
} else {
  // Verify content changed
  if (content === originalContent) {
    console.error('❌ ERROR: Content did not change!');
    process.exit(1);
  }

  // Write updated file
  fs.writeFileSync(sampleDataPath, content, 'utf-8');

  console.log(`✅ Successfully updated sampleData.js!`);
  console.log(`   🔄 Replaced: ${replacementCount} placeholder URLs`);
  console.log(`   📦 Total Firebase URLs available: ${availableUrls.length}\n`);

  // Show sample replacements
  console.log('📋 Sample URLs used:');
  availableUrls.slice(0, 3).forEach((url, index) => {
    const filename = Object.keys(urls)[index];
    console.log(`\n   [${index + 1}] ${filename}`);
    console.log(`       └─ ${url.substring(0, 80)}...`);
  });

  if (availableUrls.length > 3) {
    console.log(`\n   ... and ${availableUrls.length - 3} more URLs\n`);
  }

  console.log('✨ Next step: Run `npm run build && firebase deploy`\n');
}

process.exit(0);
