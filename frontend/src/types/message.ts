export interface User {
  id: number;
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
  type: 'recruiter' | 'applicant';
}

export interface Message {
  id: string;
  content: string;
  senderId: number;
  senderType: 'recruiter' | 'applicant';
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastUpdated: string;
} 