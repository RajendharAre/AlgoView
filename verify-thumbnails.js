/**
 * Video Thumbnails Verification Utility
 * Tests all videos to ensure thumbnails and video IDs are valid
 */

import { videosConfig } from './src/utils/videosConfig.js';

console.log('🔍 VIDEO THUMBNAILS VERIFICATION REPORT\n');
console.log('='.repeat(80));

let totalVideos = videosConfig.length;
let videosWithThumbnails = 0;
let videosWithoutThumbnails = 0;
let invalidVideoIds = 0;
let missingThumbnails = [];
let invalidIds = [];

// Test each video
videosConfig.forEach((video, index) => {
  const hasTitle = !!video.title;
  const hasThumbnail = !!video.thumbnail && video.thumbnail.startsWith('http');
  const hasVideoUrl = !!video.videoUrl;
  
  // Extract video ID from thumbnail URL
  const thumbnailMatch = video.thumbnail?.match(/vi\/([a-zA-Z0-9_-]+)\//);
  const thumbnailVideoId = thumbnailMatch ? thumbnailMatch[1] : null;
  
  // Extract video ID from videoUrl
  const urlMatch = video.videoUrl?.match(/embed\/([a-zA-Z0-9_-]+)/);
  const urlVideoId = urlMatch ? urlMatch[1] : null;
  
  // Check if IDs match
  const idsMatch = thumbnailVideoId === urlVideoId;

  if (hasThumbnail) {
    videosWithThumbnails++;
  } else {
    videosWithoutThumbnails++;
    missingThumbnails.push({
      index: index + 1,
      id: video.id,
      title: video.title
    });
  }

  if (!idsMatch && thumbnailVideoId && urlVideoId) {
    invalidIds.push({
      index: index + 1,
      id: video.id,
      title: video.title,
      thumbnailId: thumbnailVideoId,
      urlId: urlVideoId
    });
  }

  // Detailed output
  console.log(`\n${index + 1}. ${video.title}`);
  console.log(`   ID: ${video.id}`);
  console.log(`   Thumbnail URL: ${hasThumbnail ? '✓ Present' : '✗ MISSING'}`);
  if (thumbnailVideoId) {
    console.log(`   Thumbnail Video ID: ${thumbnailVideoId}`);
  }
  console.log(`   Video URL: ${hasVideoUrl ? '✓ Present' : '✗ MISSING'}`);
  if (urlVideoId) {
    console.log(`   Embed Video ID: ${urlVideoId}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 SUMMARY');
console.log(`Total Videos: ${totalVideos}`);
console.log(`Videos with Thumbnails: ${videosWithThumbnails} (${((videosWithThumbnails/totalVideos)*100).toFixed(1)}%)`);
console.log(`Videos without Thumbnails: ${videosWithoutThumbnails} (${((videosWithoutThumbnails/totalVideos)*100).toFixed(1)}%)`);
console.log(`Video IDs Mismatch: ${invalidIds.length}`);

if (missingThumbnails.length > 0) {
  console.log('\n⚠️  MISSING THUMBNAILS:');
  missingThumbnails.forEach(v => {
    console.log(`   ${v.index}. ${v.title} (ID: ${v.id})`);
  });
}

if (invalidIds.length > 0) {
  console.log('\n⚠️  VIDEO ID MISMATCHES:');
  invalidIds.forEach(v => {
    console.log(`   ${v.index}. ${v.title}`);
    console.log(`      Thumbnail ID: ${v.thumbnailId}`);
    console.log(`      Embed URL ID: ${v.urlId}`);
  });
}

if (missingThumbnails.length === 0 && invalidIds.length === 0) {
  console.log('\n✅ ALL VIDEOS HAVE VALID THUMBNAILS AND VIDEO IDS!\n');
} else {
  console.log('\n❌ ISSUES FOUND - SEE ABOVE FOR DETAILS\n');
}
