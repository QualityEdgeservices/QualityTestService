import React, { createContext, useContext, useReducer, useEffect } from 'react';
import useChatAPI from '../hooks/useChatAPI';

const ChatContext = createContext();

// Action types
const ACTION_TYPES = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CHAT: 'CLEAR_CHAT',
};

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_MESSAGES:
      return { ...state, messages: action.payload };
    case ACTION_TYPES.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTION_TYPES.CLEAR_CHAT:
      return { ...state, messages: [] };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  messages: [
    {
      id: 1,
      text: "Hi there! 👋 I'm your exam preparation assistant. How can I help you today?",
      sender: 'bot'
    }
  ],
  isLoading: false,
  error: null,
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { startChat, sendMessage, clearChat, loading, error } = useChatAPI();

  // Sync loading state
  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  }, [loading]);

  // Sync error state
  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  }, [error]);

  // Initialize chat session
  const initializeChat = async () => {
    try {
      const response = await startChat();
      if (response.success && state.messages.length <= 1) {
        dispatch({
          type: ACTION_TYPES.SET_MESSAGES,
          payload: [{
            id: 1,
            text: response.initialMessage,
            sender: 'bot'
          }]
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        payload: {
          id: Date.now(),
          text: "I'm having trouble connecting right now. Please try again later.",
          sender: 'bot'
        }
      });
    }
  };

  // Send a message to the chatbot
  const sendChatMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user'
    };
    
    dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: userMessage });

    try {
      // Send to backend and get response
      const response = await sendMessage(messageText);
      
      if (response.success) {
        // Add bot response
        const botResponse = {
          id: Date.now() + 1,
          text: response.message,
          sender: 'bot'
        };
        dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: botResponse });
      }
    } catch (err) {
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'bot'
      };
      dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: errorResponse });
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    try {
      await clearChat();
      dispatch({ type: ACTION_TYPES.CLEAR_CHAT });
      await initializeChat(); // Start a fresh session
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  const value = {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    initializeChat,
    sendChatMessage,
    clearChatHistory,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};