// Re-export types from web app
export type UserRole = 'student' | 'mentor' | 'organization' | 'sponsor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  organizationName?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  profileComplete: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface StudentProfile {
  grade?: string;
  school?: string;
  interests: string[];
  goals?: string;
  parentEmail?: string;
}

export interface MentorProfile {
  specialty: string[];
  bio?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  availability?: any[];
}

export interface Event {
  id: string;
  title: string;
  type: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: any;
  organizerId: string;
  capacity?: number;
  registeredCount: number;
  registrationOpen: boolean;
  imageUrls: string[];
  tags: string[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: Record<string, number>;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  topic?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}
