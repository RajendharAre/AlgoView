#!/usr/bin/env node

/**
 * Apply Image Mapping to sampleData.js
 * 
 * This script updates tutorial imageUrl fields with Firebase URLs
 * 
 * Usage:
 *   1. Create firebase-image-mapping.json with your URLs
 *   2. Run: node scripts/apply-image-mapping.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const mappingPath = path.join(__dirname, '../firebase-image-mapping.json');
const sampleDataPath = path.join(__dirname, '../src/utils/sampleData.js');

console.log('\n' + '='.repeat(70));
console.log('🔗 Apply Image Mapping to sampleData.js');
console.log('='.repeat(70) + '\n');

// Check if mapping file exists
if (!fs.existsSync(mappingPath)) {
  console.error('❌ ERROR: firebase-image-mapping.json not found!');
  console.error('\n📝 Create the file with this structure:\n');
  console.log(`{
  "React Hooks - Complete Guide": "https://firebasestorage.googleapis.com/...",
  "Node.js REST API Development": "https://firebasestorage.googleapis.com/...",
  ...
}`);
  console.error('\nThen run this script again.\n');
  process.exit(1);
}

// Check if sampleData.js exists
if (!fs.existsSync(sampleDataPath)) {
  console.error('❌ ERROR: src/utils/sampleData.js not found!');
  process.exit(1);
}

// Load mapping
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
console.log(`📋 Loaded mapping with ${Object.keys(mapping).length} entries\n`);

// Read sampleData.js
let content = fs.readFileSync(sampleDataPath, 'utf-8');
const originalContent = content;
let replacementCount = 0;

// Apply each mapping
for (const [tutorialTitle, firebaseUrl] of Object.entries(mapping)) {
  // Escape special regex characters
  const escapedTitle = tutorialTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Pattern: find title: "Tutorial Title" ... imageUrl: "...", then replace URL
  const pattern = new RegExp(
    `(title:\\s*"${escapedTitle}"[^}]*?imageUrl:\\s*)"[^"]*"`,
    's'
  );
  
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1"${firebaseUrl}"`);
    replacementCount++;
    console.log(`✅ Updated: ${tutorialTitle}`);
    console.log(`   → ${firebaseUrl.substring(0, 80)}...\n`);
  } else {
    console.warn(`⚠️  Not found: ${tutorialTitle}\n`);
  }
}

// Write updated content if changes were made
if (content !== originalContent) {
  fs.writeFileSync(sampleDataPath, content, 'utf-8');
  
  console.log('='.repeat(70));
  console.log(`\n✅ SUCCESS! Updated ${replacementCount} tutorial image URLs\n`);
  console.log('📊 Summary:');
  console.log(`   ✅ Replaced: ${replacementCount} URLs`);
  console.log(`   📦 Total in mapping: ${Object.keys(mapping).length}\n`);
  
  console.log('🎯 Next steps:\n');
  console.log('   1. Test locally:');
  console.log('      npm run dev\n');
  console.log('   2. Verify images display correctly\n');
  console.log('   3. Build & deploy:');
  console.log('      npm run build');
  console.log('      firebase deploy\n');
  
} else {
  console.error('\n❌ No changes were made. Check if tutorial titles match exactly.\n');
  process.exit(1);
}

console.log('=' .repeat(70) + '\n');
