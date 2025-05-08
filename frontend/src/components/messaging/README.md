# Messaging Components

This directory contains React components that implement the messaging feature for AutoCareers, allowing recruiters and applicants to communicate directly.

## Component Structure

- **MessageBoard.tsx**: The main container component for the messaging system
- **ConversationList.tsx**: Displays a list of conversations in the sidebar
- **ConversationItem.tsx**: Individual conversation item in the sidebar
- **ConversationView.tsx**: Displays the currently selected conversation
- **MessageList.tsx**: Displays all messages in a conversation
- **MessageItem.tsx**: Individual message bubble
- **MessageInput.tsx**: Input field for sending new messages

## Features

- Real-time messaging between recruiters and applicants
- Conversation history with timestamps
- Message read status tracking
- User typing indicators (prepared but not fully implemented)
- Search functionality for finding conversations
- Responsive design for various screen sizes

## Integration with Backend

The components are designed to work with the AutoCareers messaging API. The service layer in `src/services/messageService.ts` contains methods for:

- Fetching conversations
- Fetching messages
- Sending messages
- Marking messages as read
- WebSocket integration for real-time updates

## Type Definitions

The messaging components use TypeScript interfaces defined in `src/types/message.ts`:

- `User`: Represents a participant in a conversation
- `Message`: Represents an individual message
- `Conversation`: Represents a conversation between users

## Usage

To include the messaging feature in any page of the application:

```tsx
import MessageBoard from './components/messaging/MessageBoard';

// In your component:
const currentUser = {
  id: userId,
  name: userName,
  type: userType, // 'recruiter' or 'applicant'
};

return <MessageBoard currentUser={currentUser} />;
```

## Styling

The components use Material UI for consistent styling. Custom styled components are used for specific UI elements like message bubbles.

## Future Improvements

- Add emoji picker integration
- Add file attachments
- Implement group conversations
- Add notification system
- Add message deletion/editing functionality 