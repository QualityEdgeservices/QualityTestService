import React, { useState, useEffect, useRef } from 'react';
import { Send, Minimize, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../contexts/ChatContext.jsx';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const chatContainerRef = useRef(null);
  const { messages, isLoading, sendChatMessage, clearChatHistory, initializeChat } = useChat();

  // Quick replies
  const quickReplies = [
    "How to get started with exam preparation?",
    "What are the best study techniques?",
    "How to manage time during exams?",
    "Tell me about your subscription plans"
  ];

  // Initialize chat when component mounts
  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Hide quick replies after user sends a message
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.sender === 'user');
    if (userMessages.length > 0) {
      setShowQuickReplies(false);
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() === '' || isLoading) return;
    sendChatMessage(message);
    setMessage('');
    setShowQuickReplies(false);
  };

  // Handle key press for message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle quick reply selection
  const handleQuickReply = (reply) => {
    setMessage(reply);
    if (!isOpen) {
      setIsOpen(true);
      // Wait for chat to open before sending
      setTimeout(() => {
        handleSendMessage();
      }, 300);
    } else {
      handleSendMessage();
    }
  };

  // Format message text to remove markdown and improve appearance
  const formatMessage = (text) => {
    // Remove ** bold markers and other simple markdown
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
      .replace(/`(.*?)`/g, '$1'); // Remove `code`
    
    // Split into paragraphs if there are line breaks
    const paragraphs = formattedText.split('\n\n');
    
    if (paragraphs.length > 1) {
      return paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? 'mt-2' : ''}>
          {paragraph}
        </p>
      ));
    }
    
    return formattedText;
  };

  // Clear chat and reset quick replies
  const handleClearChat = () => {
    clearChatHistory();
    setShowQuickReplies(true);
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200
                w-[90vw] h-[70vh] max-w-md max-h-96
                sm:w-80 sm:h-96
                md:w-96"
            >
              {/* Chat header */}
              <div className="bg-indigo-600 text-white p-3 sm:p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium text-sm sm:text-base">Exam Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleClearChat}
                    className="text-white hover:text-indigo-200 transition-colors p-1"
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-indigo-200 transition-colors p-1"
                  >
                    <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
              
              {/* Chat messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
              >
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg text-sm sm:text-base ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {formatMessage(msg.text)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none p-3 shadow-sm">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick replies - only show if no messages yet */}
              {showQuickReplies && messages.length <= 1 && (
                <div className="px-3 pt-2 bg-gray-100 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2 pb-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 hover:bg-indigo-200 transition-colors border border-indigo-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Chat input */}
              <div className="p-2 sm:p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={message.trim() === '' || isLoading}
                    className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center
                h-12 w-12
                sm:h-14 sm:w-14"
              aria-label="Open chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <motion.div
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile quick replies when chat is closed - only show if no messages yet */}
      <AnimatePresence>
        {!isOpen && showQuickReplies && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 z-40 sm:hidden"
          >
            <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {quickReplies.slice(0, 2).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-1 hover:bg-indigo-200 transition-colors border border-indigo-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;