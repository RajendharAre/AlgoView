#!/usr/bin/env node
/**
 * Migration script: Pushes global notifications to all users' subcollections
 * This creates user-specific notifications with status="unread"
 * 
 * Usage: node scripts/migrate-notifications-to-users.js
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, writeBatch, collection, getDocs, serverTimestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found in project root');
  console.error('Please download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const apps = getApps();
if (apps.length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

async function migrateNotificationsToUsers() {
  try {
    console.log('🚀 Starting notification migration to user subcollections...\n');

    // Step 1: Get all global notifications
    console.log('📥 Fetching global notifications...');
    const notificationsSnapshot = await getDocs(collection(db, 'notifications'));
    
    if (notificationsSnapshot.empty) {
      console.log('⚠️  No notifications found in global collection');
      return;
    }

    const globalNotifications = notificationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Found ${globalNotifications.length} global notification(s)\n`);

    // Step 2: Get all users
    console.log('👥 Fetching all users...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    if (usersSnapshot.empty) {
      console.log('⚠️  No users found in database');
      return;
    }

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Found ${users.length} user(s)\n`);

    // Step 3: Push notifications to each user's subcollection
    let totalNotificationsCreated = 0;

    for (const user of users) {
      console.log(`📤 Pushing notifications to user: ${user.id}`);
      
      let userNotificationCount = 0;
      const batch = writeBatch(db);

      for (const notification of globalNotifications) {
        const userNotifRef = db
          .collection('users')
          .doc(user.id)
          .collection('notifications')
          .doc(notification.id);

        // Create notification with status='unread'
        batch.set(userNotifRef, {
          title: notification.title,
          message: notification.message,
          content: notification.content || '',
          type: notification.type || 'update',
          priority: notification.priority || 'medium',
          status: 'unread', // NEW: All migrated notifications start as unread
          createdAt: notification.createdAt || serverTimestamp(),
          migratedAt: serverTimestamp(),
        });

        userNotificationCount++;
      }

      if (userNotificationCount > 0) {
        await batch.commit();
        console.log(`   ✅ Added ${userNotificationCount} notification(s)`);
        totalNotificationsCreated += userNotificationCount;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✨ Migration Complete!`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📊 Summary:`);
    console.log(`   • Users: ${users.length}`);
    console.log(`   • Notifications per user: ${globalNotifications.length}`);
    console.log(`   • Total user notifications created: ${totalNotificationsCreated}`);
    console.log(`   • Location: users/{userId}/notifications`);
    console.log(`   • Status: All notifications set to 'unread'\n`);

    console.log('🎉 All user-specific notifications have been created!\n');
    console.log('What happens next:');
    console.log('  1. Users will see notifications in their bell icon');
    console.log('  2. Users can dismiss notifications (status → "deleted")');
    console.log('  3. Dismissals are persistent per user in Firestore');
    console.log('  4. When admin creates NEW notifications, push them to users\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateNotificationsToUsers();
