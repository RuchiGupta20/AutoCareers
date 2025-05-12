import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, styled, Paper, Divider, Avatar, Chip } from '@mui/material';
import ConversationList from '../components/ConversationList';
import ConversationView from '../components/ConversationView';
import { User, Message } from '../types/message';
import * as messageService from '../services/messageService';

interface RecruiterMessageBoardProps {
  currentUser: {
    id: number;
    name: string;
    type: 'recruiter' | 'applicant';
  };
}

const MessageBoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 64px)', // Adjust based on your nav height
  backgroundColor: '#fff',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 320,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

const TabPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const ApplicantCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Sample applicants for the recruiter to message
const SAMPLE_APPLICANTS: User[] = [
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
];

const RecruiterMessageBoard: React.FC<RecruiterMessageBoardProps> = ({ currentUser }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<{id: string, user: User}[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch conversations when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getConversations(currentUser.id);
        
        // Format conversations for the UI
        const formattedConversations = data.map(conv => {
          // Find the other participant (not the current user)
          const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
          return {
            id: conv.id,
            user: otherParticipant || { 
              id: 0, 
              name: "Unknown User", 
              type: "applicant" as const, 
              avatar: "" 
            }
          };
        });
        
        setConversations(formattedConversations);
        
        // Auto-select the first conversation if none is selected
        if (!selectedConversationId && formattedConversations.length > 0 && tabValue === 0) {
          setSelectedConversationId(formattedConversations[0].id);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Periodically refresh conversations
    const intervalId = setInterval(fetchConversations, 15000);
    
    return () => clearInterval(intervalId);
  }, [currentUser.id, selectedConversationId, tabValue]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversationId) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getConversationMessages(selectedConversationId);
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Periodically refresh messages for the selected conversation
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [selectedConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (tabValue !== 0) setTabValue(0);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    try {
      const response = await messageService.sendMessage(
        content,
        currentUser.id,
        currentUser.type,
        selectedConversationId
      );
      
      if (response) {
        // Immediately update the UI with the new message
        setMessages(prevMessages => {
          if (!prevMessages.some(msg => msg.id === response.id)) {
            return [...prevMessages, response];
          }
          return prevMessages;
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleStartNewConversation = async (applicant: User) => {
    // Check if a conversation already exists
    const existingConv = conversations.find(c => c.user.id === applicant.id);
    
    if (existingConv) {
      // Conversation exists, select it
      setSelectedConversationId(existingConv.id);
      setTabValue(0);
      return;
    }
    
    // Create a new conversation
    try {
      const newConversation = await messageService.createConversation(
        'New Conversation',
        [currentUser.id, applicant.id],
        [currentUser.type, applicant.type]
      );
      
      if (newConversation) {
        // Add to conversations list
        setConversations(prev => [
          ...prev,
          {
            id: newConversation.id,
            user: applicant
          }
        ]);
        
        // Select the new conversation
        setSelectedConversationId(newConversation.id);
        setTabValue(0);
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  // Get participants for active conversation
  const getActiveConversationParticipants = () => {
    if (!selectedConversationId) return [];
    
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return [];
    
    return [
      conversation.user,
      {
        id: currentUser.id,
        name: currentUser.name,
        type: currentUser.type,
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      }
    ];
  };

  // Get active conversation with all needed data
  const activeConversation = selectedConversationId
    ? {
        id: selectedConversationId,
        title: 'Conversation',
        messages: messages,
        participants: getActiveConversationParticipants(),
        startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
      }
    : null;

  // Filter applicants based on search term
  const filteredApplicants = SAMPLE_APPLICANTS.filter(applicant => 
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MessageBoardContainer>
      <SidebarContainer>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Chats" />
          <Tab label="Applicants" />
        </Tabs>
        
        {tabValue === 0 && (
          <TabPanel>
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
            />
          </TabPanel>
        )}
        
        {tabValue === 1 && (
          <TabPanel>
            <Box sx={{ p: 2 }}>
              <TextField
                placeholder="Search applicants..."
                fullWidth
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              {filteredApplicants.map(applicant => (
                <ApplicantCard 
                  key={applicant.id}
                  onClick={() => handleStartNewConversation(applicant)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar src={applicant.avatar} alt={applicant.name} />
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {applicant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {applicant.title} • {applicant.experience}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {applicant.skills?.map(skill => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                  </Box>
                </ApplicantCard>
              ))}
            </Box>
          </TabPanel>
        )}
      </SidebarContainer>
      
      {isLoading && !conversations.length && tabValue === 0 && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography>Loading conversations...</Typography>
        </Box>
      )}
      
      <ConversationView
        conversation={activeConversation}
        currentUserId={currentUser.id}
        onSendMessage={handleSendMessage}
      />
    </MessageBoardContainer>
  );
};

export default RecruiterMessageBoard; 