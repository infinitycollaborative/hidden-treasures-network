/**
 * Session Types for Mentor-Student Sessions
 */

export type SessionStatus =
  | 'requested'
  | 'approved'
  | 'declined'
  | 'cancelled'
  | 'completed'

export interface TimeSlot {
  date: string      // ISO date 'YYYY-MM-DD'
  startTime: string // 'HH:MM'
  endTime: string   // 'HH:MM'
}

export interface MentorSession {
  id: string
  studentId: string
  mentorId: string
  requestedBy: 'student' | 'mentor'
  requestedTimeSlots: TimeSlot[]
  chosenSlot?: TimeSlot
  topic?: string
  notes?: string
  status: SessionStatus
  createdAt: any  // Firebase Timestamp
  updatedAt: any  // Firebase Timestamp
  meetingUrl?: string // for virtual sessions
}
