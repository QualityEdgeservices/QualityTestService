import { useState, useCallback } from 'react';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

const useChatAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate or retrieve user ID
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
      userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatUserId', userId);
    }
    return userId;
  }, []);

  // Start a new chat session
  const startChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const response = await api.post('/chat/start', { userId });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to start chat';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  // Send a message to the chatbot
  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const response = await api.post('/chat/message', { userId, message });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send message';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  // Clear chat history
  const clearChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const response = await api.post('/chat/clear', { userId });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to clear chat';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  return {
    loading,
    error,
    startChat,
    sendMessage,
    clearChat,
  };
};

export default useChatAPI;