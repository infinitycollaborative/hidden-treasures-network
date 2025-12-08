/**
 * Message Types for Secure 1:1 Messaging
 */

export interface MessageThread {
  id: string
  participantIds: string[] // 2-party for now
  createdAt: any  // Firebase Timestamp
  updatedAt: any  // Firebase Timestamp
  lastMessagePreview?: string
  lastMessageAt?: any  // Firebase Timestamp
  relatedSessionId?: string // optional linkage to a mentor session
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  body: string
  createdAt: any  // Firebase Timestamp
  readBy: string[] // userIds who have read this message
}
