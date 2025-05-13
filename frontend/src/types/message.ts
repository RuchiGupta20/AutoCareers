/**
 * Represents a user in the messaging system
 * Can be either a recruiter or an applicant
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** Full name of the user */
  name: string;
  /** Job title of the user (if available) */
  title?: string;
  /** Company the user belongs to (mainly for recruiters) */
  company?: string;
  /** URL to the user's avatar image */
  avatar?: string;
  /** Type of user - determines their role and permissions */
  type: 'recruiter' | 'applicant';
  /** List of skills (mainly for applicants) */
  skills?: string[];
  /** Work experience summary (mainly for applicants) */
  experience?: string;
}

/**
 * Represents a single message in a conversation
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Text content of the message */
  content: string;
  /** ID of the user who sent the message */
  senderId: number;
  /** Type of the sender (recruiter or applicant) */
  senderType: 'recruiter' | 'applicant';
  /** ISO timestamp when the message was sent */
  timestamp: string;
  /** Whether the message has been read by the recipient */
  read: boolean;
}

/**
 * Represents a conversation between users
 */
export interface Conversation {
  /** Unique identifier for the conversation */
  id: string;
  /** Users participating in the conversation */
  participants: User[];
  /** List of messages in the conversation */
  messages: Message[];
  /** ISO timestamp when the conversation was last updated */
  lastUpdated: string;
} 