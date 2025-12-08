import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'

import { db } from './firebase'
import { AppNotification } from '@/types/notification'
import { UserRole } from '@/types'

const notificationsCollection = collection(db, 'notifications')

function mapNotification(snapshot: any): AppNotification {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    userId: data.userId,
    title: data.title || '',
    message: data.message || '',
    type: data.type,
    link: data.link,
    read: data.read || false,
    createdAt: (data.createdAt?.toDate?.() as Date) || new Date(),
  }
}

export async function createNotification(
  userId: string,
  data: Partial<AppNotification>
): Promise<AppNotification> {
  const docRef = data.id ? doc(notificationsCollection, data.id) : doc(notificationsCollection)
  await setDoc(docRef, {
    ...data,
    userId,
    read: data.read ?? false,
    createdAt: serverTimestamp(),
  })
  const snapshot = await getDoc(docRef)
  return snapshot.exists() ? mapNotification(snapshot) : mapNotification({ id: docRef.id, data: () => data })
}

export async function getNotificationsForUser(userId: string): Promise<AppNotification[]> {
  const snapshot = await getDocs(
    query(notificationsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(mapNotification)
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true })
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const snapshot = await getDocs(
    query(notificationsCollection, where('userId', '==', userId), where('read', '==', false))
  )
  const batch = writeBatch(db)
  snapshot.forEach((docSnap) => {
    batch.update(docSnap.ref, { read: true })
  })
  await batch.commit()
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await deleteDoc(doc(db, 'notifications', notificationId))
}

export async function sendBroadcastNotification(
  role: UserRole,
  data: Partial<AppNotification>
): Promise<void> {
  const usersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', role)))
  const tasks = usersSnapshot.docs.map((user) =>
    createNotification(user.id, {
      title: data.title || 'Network update',
      message: data.message || 'You have a new notification.',
      type: data.type || 'system_broadcast',
      link: data.link,
      read: false,
    })
  )
  await Promise.all(tasks)
}

export function watchUserNotifications(
  userId: string,
  callback: (notifications: AppNotification[]) => void
): () => void {
  const q = query(notificationsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const mapped = snapshot.docs.map(mapNotification)
    callback(mapped)
  })
  return unsubscribe
}

export const notificationIndexes = {
  indexes: [
    { fields: ['userId', 'read'] },
    { field: 'createdAt' },
  ],
}
