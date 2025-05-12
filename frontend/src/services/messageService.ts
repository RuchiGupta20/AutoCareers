import { Conversation, Message, User } from '../types/message';

// Local test data - users
const USERS: User[] = [
  {
    id: 1,
    name: 'Jan Mayer',
    title: 'Recruiter',
    company: 'Nomad',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'John Doe',
    title: 'Recruiter',
    company: 'TechCorp',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
  },
  {
    id: 3,
    name: 'Sarah Smith',
    title: 'Recruiter',
    company: 'Innovate Inc',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
  {
    id: 4,
    name: 'Current User (Applicant)',
    title: 'Software Developer',
    type: 'applicant',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: '3 years'
  },
  {
    id: 5,
    name: 'Current User (Recruiter)',
    title: 'Tech Recruiter',
    company: 'TalentMatch',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  // Applicants for recruiter to message
  {
    id: 101,
    name: 'Emily Johnson',
    title: 'Frontend Developer',
    type: 'applicant',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    skills: ['React', 'TypeScript', 'CSS'],
    experience: '4 years'
  },
  {
    id: 102,
    name: 'Michael Chen',
    title: 'Full Stack Engineer',
    type: 'applicant',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    skills: ['Node.js', 'React', 'MongoDB'],
    experience: '6 years'
  },
  {
    id: 103,
    name: 'Sofia Rodriguez',
    title: 'UI/UX Designer',
    type: 'applicant',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    skills: ['Figma', 'Adobe XD', 'User Research'],
    experience: '3 years'
  },
  // New recruiters to message the applicant
  {
    id: 6,
    name: 'Alex Thompson',
    title: 'Technical Recruiter',
    company: 'FutureTech',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: 7,
    name: 'Jessica Williams',
    title: 'Senior HR Manager',
    company: 'GlobalSoft',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    id: 8,
    name: 'Robert Davis',
    title: 'Head of Talent Acquisition',
    company: 'CodeNation',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
  }
];

// Local test data - conversations
const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [USERS[0], USERS[3]],
    messages: [
      {
        id: '1',
        content: 'Hey, I saw your profile and was impressed with your skills. Would you be interested in a position at Nomad?',
        senderId: 1,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 48 * 60000).toISOString(),
        read: true
      },
      {
        id: '2',
        content: 'We have an exciting opportunity for a Senior Frontend Developer role.',
        senderId: 1,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 47 * 60000).toISOString(),
        read: true
      },
      {
        id: '3',
        content: 'Hi Jan, thank you for reaching out! I would definitely be interested in learning more about the position.',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
        read: true
      }
    ],
    lastUpdated: new Date(Date.now() - 40 * 60000).toISOString()
  },
  {
    id: '2',
    participants: [USERS[1], USERS[3]],
    messages: [
      {
        id: '4',
        content: 'Hello! We\'re looking for React developers at TechCorp. Would you be available for an interview?',
        senderId: 2,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 24 * 60000).toISOString(),
        read: true
      },
      {
        id: '5',
        content: 'The role involves working with our core product team on exciting new features.',
        senderId: 2,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 23 * 60000).toISOString(),
        read: true
      },
      {
        id: '6',
        content: 'Thanks for thinking of me! I\'d like to know more about the team and project scope.',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
        read: true
      },
      {
        id: '7',
        content: 'Could you share more details about the tech stack you\'re using?',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 17 * 60000).toISOString(),
        read: false
      }
    ],
    lastUpdated: new Date(Date.now() - 17 * 60000).toISOString()
  },
  {
    id: '3',
    participants: [USERS[2], USERS[3]],
    messages: [
      {
        id: '8',
        content: 'Hi there! I found your profile and wanted to discuss a potential opportunity at Innovate Inc.',
        senderId: 3,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        read: false
      }
    ],
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString()
  },
  // New conversations for the applicant
  {
    id: '6',
    participants: [USERS[8], USERS[3]],
    messages: [
      {
        id: '20',
        content: 'Hello there! I\'m Robert from CodeNation. We have an exciting Senior Developer role that would be perfect for someone with your React and Node.js experience.',
        senderId: 8,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 52 * 60000).toISOString(),
        read: true
      },
      {
        id: '21',
        content: 'The position offers competitive salary, remote work options, and opportunity to work on cutting-edge projects.',
        senderId: 8,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 51 * 60000).toISOString(),
        read: true
      },
      {
        id: '22',
        content: 'Hi Robert, thanks for reaching out! I\'m very interested in learning more about this opportunity at CodeNation.',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
        read: true
      },
      {
        id: '23',
        content: 'Could you tell me more about the team size and the specific projects I would be working on?',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 49 * 60000).toISOString(),
        read: true
      },
      {
        id: '24',
        content: 'Absolutely! The team is currently 12 developers strong and growing. You would be working on our flagship product, a collaborative coding platform used by over 50,000 developers.',
        senderId: 8,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        read: true
      },
      {
        id: '25',
        content: 'Would you be available for a video interview next week?',
        senderId: 8,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 44 * 60000).toISOString(),
        read: true
      }
    ],
    lastUpdated: new Date(Date.now() - 44 * 60000).toISOString()
  },
  {
    id: '7',
    participants: [USERS[6], USERS[3]],
    messages: [
      {
        id: '26',
        content: 'Hi there. I\'m Jessica from GlobalSoft and I came across your profile. Our team is looking for a JavaScript developer with React experience.',
        senderId: 7,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        read: true
      },
      {
        id: '27',
        content: 'Hello Jessica! Thank you for reaching out. I\'m definitely interested in hearing more about the position at GlobalSoft.',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
        read: true
      },
      {
        id: '28',
        content: 'Great! The position is for a Frontend Engineer role. We offer a base salary range of $95K-$120K based on experience, plus great benefits including unlimited PTO.',
        senderId: 7,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 100 * 60000).toISOString(),
        read: true
      },
      {
        id: '29',
        content: 'That sounds promising! Could you share more about the company culture and the team I\'d be working with?',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        read: true
      },
      {
        id: '30',
        content: 'Of course! GlobalSoft has a collaborative and inclusive culture. We value work-life balance and continuous learning. The engineering team is about 30 people divided into smaller cross-functional squads.',
        senderId: 7,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 80 * 60000).toISOString(),
        read: false
      }
    ],
    lastUpdated: new Date(Date.now() - 80 * 60000).toISOString()
  },
  {
    id: '8',
    participants: [USERS[5], USERS[3]],
    messages: [
      {
        id: '31',
        content: 'Hi! I\'m Alex from FutureTech. I noticed your experience with Node.js and would love to discuss an opportunity we have for a backend-focused developer.',
        senderId: 6,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
        read: true
      },
      {
        id: '32',
        content: 'The position focuses on building scalable APIs and microservices. We\'re working on some cutting-edge AI-driven applications.',
        senderId: 6,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 74 * 60000).toISOString(),
        read: true
      },
      {
        id: '33',
        content: 'Hey Alex! Thanks for reaching out. I\'m definitely interested in backend development with Node.js. The AI-driven focus sounds really interesting!',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 70 * 60000).toISOString(),
        read: true
      },
      {
        id: '34',
        content: 'Could you tell me more about the tech stack you\'re using and the team structure?',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 69 * 60000).toISOString(),
        read: true
      },
      {
        id: '35',
        content: 'Sure thing! We use Node.js with Express, MongoDB for our database, and we\'re integrating with various AI/ML services. The team is currently 8 engineers with plans to grow to 12 this year.',
        senderId: 6,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        read: true
      },
      {
        id: '36',
        content: 'That sounds like a great match for my skills. When would be a good time to discuss the next steps?',
        senderId: 4,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        read: true
      },
      {
        id: '37',
        content: 'How about next Monday at 2 PM? I can set up a video call with our engineering manager to discuss the role in more detail.',
        senderId: 6,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        read: false
      }
    ],
    lastUpdated: new Date(Date.now() - 30 * 60000).toISOString()
  },
  // Recruiter conversations
  {
    id: '4',
    participants: [USERS[5], USERS[7]],
    messages: [
      {
        id: '9',
        content: 'Hi Emily, I\'m reaching out about a Frontend Developer position at TalentMatch. Your React and TypeScript skills would be perfect for this role.',
        senderId: 5,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        read: true
      },
      {
        id: '10',
        content: 'Hi there! Thanks for reaching out. I\'d love to hear more about the position.',
        senderId: 101,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 115 * 60000).toISOString(),
        read: true
      },
      {
        id: '11',
        content: 'Great! It\'s a full-time role working on our e-commerce platform. The salary range is $90-110K. Would you be interested in scheduling an interview?',
        senderId: 5,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
        read: true
      }
    ],
    lastUpdated: new Date(Date.now() - 110 * 60000).toISOString()
  },
  {
    id: '5',
    participants: [USERS[5], USERS[8]],
    messages: [
      {
        id: '12',
        content: 'Hello Michael, I have a Full Stack Engineer position that matches your experience with Node.js and MongoDB. Are you currently open to new opportunities?',
        senderId: 5,
        senderType: 'recruiter',
        timestamp: new Date(Date.now() - 72 * 60000).toISOString(),
        read: true
      },
      {
        id: '13',
        content: 'I\'m always interested in hearing about new opportunities. Can you tell me more about the company and role?',
        senderId: 102,
        senderType: 'applicant',
        timestamp: new Date(Date.now() - 68 * 60000).toISOString(),
        read: true
      }
    ],
    lastUpdated: new Date(Date.now() - 68 * 60000).toISOString()
  }
];

// Keep track of message ID to ensure uniqueness
let nextMessageId = 40;

// Get all conversations for a user
export const getConversations = async (userId: number): Promise<Conversation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter conversations where the user is a participant
  return CONVERSATIONS.filter(conversation => 
    conversation.participants.some(p => p.id === userId)
  );
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find the conversation
  const conversation = CONVERSATIONS.find(c => c.id === conversationId);
  
  if (!conversation) {
    return [];
  }
  
  return conversation.messages;
};

// Send a message
export const sendMessage = async (
  content: string,
  senderId: number,
  senderType: 'recruiter' | 'applicant',
  conversationId: string
): Promise<Message | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find the conversation
  const conversationIndex = CONVERSATIONS.findIndex(c => c.id === conversationId);
  
  if (conversationIndex === -1) {
    console.error('Conversation not found');
    return null;
  }
  
  // Create new message
  const newMessage: Message = {
    id: String(nextMessageId++),
    content,
    senderId,
    senderType,
    timestamp: new Date().toISOString(),
    read: false,
  };
  
  // Add message to conversation
  CONVERSATIONS[conversationIndex].messages.push(newMessage);
  CONVERSATIONS[conversationIndex].lastUpdated = newMessage.timestamp;
  
  return newMessage;
};

// Mark message as read
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Find the message in all conversations
  for (const conversation of CONVERSATIONS) {
    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
      conversation.messages[messageIndex].read = true;
      return true;
    }
  }
  
  return false;
};

// Create a new conversation
export const createConversation = async (
  title: string,
  participantIds: number[],
  participantTypes: ('recruiter' | 'applicant')[]
): Promise<Conversation | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find participants
  const participants: User[] = [];
  
  for (let i = 0; i < participantIds.length; i++) {
    const userId = participantIds[i];
    const user = USERS.find(u => u.id === userId);
    
    if (user) {
      participants.push(user);
    } else {
      // Create a placeholder user if not found
      participants.push({
        id: userId,
        name: `User ${userId}`,
        type: participantTypes[i],
        avatar: `https://randomuser.me/api/portraits/men/${userId % 99}.jpg`
      });
    }
  }
  
  // Create conversation
  const newConversation: Conversation = {
    id: `${CONVERSATIONS.length + 1}`,
    participants,
    messages: [],
    lastUpdated: new Date().toISOString(),
  };
  
  // Add to conversations
  CONVERSATIONS.push(newConversation);
  
  return newConversation;
}; 