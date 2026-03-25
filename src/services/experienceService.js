import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const experiencesCollection = collection(db, 'platformExperiences')

export const submitPlatformExperience = async ({ user, name, role, specificRole, institution, rating, emotions, experience, timestamp, status }) => {
  const resolvedRole = role || 'student'
  const payload = {
    userId: user?.uid || null,
    name: name.trim(),
    role: resolvedRole,
    specificRole: (specificRole || '').trim(),
    institution: institution.trim(),
    userType: resolvedRole,
    rating: Number(rating),
    emotions: Array.isArray(emotions) ? emotions : [],
    experience: (experience || '').trim(),
    content: (experience || '').trim(),
    status: status || 'pending',
    timestamp: Number(timestamp || Date.now()),
    createdAt: serverTimestamp(),
  }

  await addDoc(experiencesCollection, payload)
}

export const getApprovedExperiencesListener = (callback, errorHandler) => {
  const q = query(
    experiencesCollection,
    where('status', '==', 'approved'),
    limit(24)
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const experiences = []
      snapshot.forEach((doc) => {
        experiences.push({ id: doc.id, ...doc.data() })
      })
      callback(experiences)
    },
    (error) => {
      console.error('Error fetching approved experiences:', error)
      if (errorHandler) errorHandler(error)
    }
  )
}
