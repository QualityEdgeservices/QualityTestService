// import React, { useState, useEffect, useRef } from 'react';
// import { Target, Users, TrendingUp, Clock, ChevronRight, Star, BookOpen, Award, Brain, Zap, MessageCircle, X, Send, Minimize } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// const Hero = () => {
//   const navigate = useNavigate();
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hi there! 👋 I'm your exam preparation assistant. How can I help you today?",
//       sender: 'bot'
//     }
//   ]);
//   const chatContainerRef = useRef(null);

//   // Stats data
//   const stats = [
//     {
//       icon: <Target className="h-6 w-6 text-indigo-400" />,
//       value: "98%",
//       label: "Success Rate",
//       description: "Of students achieve their target scores"
//     },
//     {
//       icon: <Users className="h-6 w-6 text-indigo-400" />,
//       value: "15+",
//       label: "Active Users",
//       description: "Join our growing community of learners"
//     },
//     {
//       icon: <TrendingUp className="h-6 w-6 text-indigo-400" />,
//       value: "2.5x",
//       label: "Faster Progress",
//       description: "Compared to traditional study methods"
//     },
//     {
//       icon: <Clock className="h-6 w-6 text-indigo-400" />,
//       value: "24/7",
//       label: "Availability",
//       description: "Study anytime, anywhere"
//     }
//   ];

//   // Features data
//   const features = [
//     { icon: <Brain className="h-5 w-5" />, text: "AI-Powered Learning" },
//     { icon: <BookOpen className="h-5 w-5" />, text: "10,000+ Questions" },
//     { icon: <Award className="h-5 w-5" />, text: "Expert Curated" },
//     { icon: <Zap className="h-5 w-5" />, text: "Adaptive Testing" }
//   ];

//   // Auto-scroll to bottom when new messages are added
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (message.trim() === '') return;
    
//     // Add user message
//     const userMessage = {
//       id: messages.length + 1,
//       text: message,
//       sender: 'user'
//     };
    
//     setMessages([...messages, userMessage]);
//     setMessage('');
    
//     // Simulate bot response after a short delay
//     setTimeout(() => {
//       const botResponse = {
//         id: messages.length + 2,
//         text: "I'm here to help with your exam preparation questions. You can ask me about study tips, exam patterns, or how to use our platform effectively!",
//         sender: 'bot'
//       };
//       setMessages(prev => [...prev, botResponse]);
//     }, 1000);
//   };

//   // Handle key press for message input
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   // Quick replies for mobile users
//   const quickReplies = [
//     "How to get started?",
//     "Exam preparation tips",
//     "Subscription plans",
//     "Contact support"
//   ];

//   return (
//     <section className="mb-10 relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Enhanced background with gradient mesh */}
//       <div className="absolute inset-0 overflow-hidden z-0">
//         {/* Gradient mesh background */}
//         <div className="absolute inset-0 opacity-30">
//           <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-900/40 rounded-full blur-6xl"></div>
//           <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-900/30 rounded-full blur-6xl"></div>
//           <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-purple-900/20 rounded-full blur-5xl"></div>
//         </div>

//         {/* Animated grid pattern */}
//         <div className="absolute inset-0 opacity-10 bg-grid-white/10"></div>

//         {/* Subtle particles */}
//         {[...Array(30)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full bg-white/10"
//             style={{
//               width: `${Math.random() * 6 + 2}px`,
//               height: `${Math.random() * 6 + 2}px`,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               x: [0, Math.random() * 30 - 15],
//               y: [0, Math.random() * 30 - 15],
//               opacity: [0.1, 0.3, 0.1],
//             }}
//             transition={{
//               duration: Math.random() * 15 + 10,
//               repeat: Infinity,
//               repeatType: 'reverse',
//               ease: 'easeInOut',
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-20 container mx-auto px-4 min-h-screen flex flex-col justify-center">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true, margin: "-100px" }}
//             className="text-center lg:text-left"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               viewport={{ once: true }}
//               className="mt-10 inline-flex items-center px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-700/50 mb-8 shadow-lg"
//             >
//               <div className="h-2 w-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></div>
//               <span className="text-sm font-medium text-indigo-200">
//                 AI-Powered Learning Platform
//               </span>
//               <motion.div 
//                 className="ml-2 h-2 w-2 bg-indigo-400 rounded-full"
//                 animate={{ scale: [1, 1.5, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               />
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3, duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
//             >
//               Master Competitive Exams with{' '}
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
//                 Intelligent Preparation
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.4, duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
//             >
//               Our adaptive learning platform uses advanced algorithms to create personalized study paths that maximize your efficiency and results.
//             </motion.p>

//             {/* Feature badges */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.8 }}
//               viewport={{ once: true }}
//               className="flex flex-wrap gap-3 mb-10 justify-center lg:justify-start"
//             >
//               {features.map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
//                   viewport={{ once: true }}
//                   whileHover={{ 
//                     y: -3,
//                     backgroundColor: 'rgba(99, 102, 241, 0.2)'
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-200 text-sm"
//                 >
//                   <span className="text-indigo-400">{feature.icon}</span>
//                   {feature.text}
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Buttons */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.7, duration: 0.8 }}
//               viewport={{ once: true }}
//               className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
//             >
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl font-medium text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
//                 onClick={() => {
//                   navigate('/login');
//                 }}
//               >
//                 <span className="relative z-10 flex items-center justify-center">
//                   Get Started Free
//                   <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </motion.button>
//             </motion.div>
//           </motion.div>

//           {/* Right Content - Stats */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true, margin: "-100px" }}
//             className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-20"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
//                 viewport={{ once: true }}
//                 whileHover={{ 
//                   y: -8, 
//                   scale: 1.03,
//                   boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)'
//                 }}
//                 className="bg-gradient-to-br from-gray-800/70 to-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group"
//               >
//                 <div className="flex flex-col">
//                   <motion.div 
//                     className="mb-4 p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 w-fit group-hover:bg-indigo-500/30 transition-colors"
//                     whileHover={{ rotate: 5 }}
//                   >
//                     {stat.icon}
//                   </motion.div>
//                   <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
//                   <p className="text-lg font-semibold text-indigo-300 mb-2">{stat.label}</p>
//                   <p className="text-gray-300 text-sm">{stat.description}</p>
//                 </div>
                
//                 {/* Subtle glow effect on hover */}
//                 <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Exam badges */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.1, duration: 0.8 }}
//           viewport={{ once: true }}
//           className="lg:mt-12"
//         >
//           <p className="text-center text-gray-400 mb-6 text-lg">Supporting preparation for</p>
//           <div className="flex flex-wrap justify-center gap-3 mb-10">
//             {['JEE', 'NEET', 'UPSC', 'GATE', 'CAT', 'SSC', 'Banking', 'GRE', 'GMAT', 'CLAT'].map((exam, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 100 }}
//                 viewport={{ once: true }}
//                 whileHover={{ 
//                   scale: 1.1,
//                   backgroundColor: 'rgba(99, 102, 241, 0.3)',
//                   color: '#fff'
//                 }}
//                 className="px-5 py-2.5 bg-gray-800/60 border border-gray-700 rounded-full text-sm font-medium text-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md"
//               >
//                 {exam}
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       {/* Responsive Chatbot */}
//       <div className="fixed z-50 
//         bottom-4 right-4 
//         sm:bottom-6 sm:right-6 
//         lg:bottom-8 lg:right-8">
//         <AnimatePresence>
//           {isChatOpen ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.8, y: 20 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200
//                 w-[90vw] h-[70vh] max-w-md max-h-96
//                 sm:w-80 sm:h-96
//                 md:w-96"
//             >
//               {/* Chat header */}
//               <div className="bg-indigo-600 text-white p-3 sm:p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <MessageCircle className="h-5 w-5 mr-2" />
//                   <span className="font-medium text-sm sm:text-base">Exam Assistant</span>
//                 </div>
//                 <button 
//                   onClick={() => setIsChatOpen(false)}
//                   className="text-white hover:text-indigo-200 transition-colors p-1"
//                 >
//                   <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
//                 </button>
//               </div>
              
//               {/* Chat messages */}
//               <div 
//                 ref={chatContainerRef}
//                 className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
//               >
//                 <div className="space-y-3">
//                   {messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div
//                         className={`max-w-xs p-3 rounded-lg text-sm sm:text-base ${
//                           msg.sender === 'user'
//                             ? 'bg-indigo-600 text-white rounded-br-none'
//                             : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
//                         }`}
//                       >
//                         {msg.text}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Quick replies for mobile */}
//               <div className="px-3 pt-2 bg-gray-100 border-t border-gray-200 hidden sm:block">
//                 <div className="flex flex-wrap gap-2">
//                   {quickReplies.map((reply, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setMessage(reply)}
//                       className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
//                     >
//                       {reply}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Chat input */}
//               <div className="p-2 sm:p-3 border-t border-gray-200 bg-white">
//                 <div className="flex items-center">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="Type your message..."
//                     className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={message.trim() === ''}
//                     className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Send className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setIsChatOpen(true)}
//               className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center
//                 h-12 w-12
//                 sm:h-14 sm:w-14"
//               aria-label="Open chat"
//             >
//               <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
//               <motion.div
//                 className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
//                 animate={{ scale: [1, 1.2, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               />
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Mobile quick replies when chat is closed */}
//       <AnimatePresence>
//         {!isChatOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.3 }}
//             className="fixed bottom-20 right-4 z-40 sm:hidden"
//           >
//             <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs">
//               <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
//               <div className="flex flex-wrap gap-1">
//                 {quickReplies.slice(0, 2).map((reply, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setMessage(reply);
//                       setIsChatOpen(true);
//                     }}
//                     className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-1 hover:bg-indigo-200 transition-colors"
//                   >
//                     {reply}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// };

// export default Hero;

import React from 'react';
import { Target, Users, TrendingUp, Clock, ChevronRight, BookOpen, Award, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';

const Hero = () => {
  const navigate = useNavigate();

  // Stats data
  const stats = [
    {
      icon: <Target className="h-6 w-6 text-indigo-400" />,
      value: "98%",
      label: "Success Rate",
      description: "Of students achieve their target scores"
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-400" />,
      value: "15+",
      label: "Active Users",
      description: "Join our growing community of learners"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-400" />,
      value: "2.5x",
      label: "Faster Progress",
      description: "Compared to traditional study methods"
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
      value: "24/7",
      label: "Availability",
      description: "Study anytime, anywhere"
    }
  ];

  // Features data
  const features = [
    { icon: <Brain className="h-5 w-5" />, text: "AI-Powered Learning" },
    { icon: <BookOpen className="h-5 w-5" />, text: "10,000+ Questions" },
    { icon: <Award className="h-5 w-5" />, text: "Expert Curated" },
    { icon: <Zap className="h-5 w-5" />, text: "Adaptive Testing" }
  ];

  return (
    <section className="mb-10 relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced background with gradient mesh */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-900/40 rounded-full blur-6xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-900/30 rounded-full blur-6xl"></div>
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-purple-900/20 rounded-full blur-5xl"></div>
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-grid-white/10"></div>

        {/* Subtle particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15],
              y: [0, Math.random() * 30 - 15],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-20 container mx-auto px-4 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-10 inline-flex items-center px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-700/50 mb-8 shadow-lg"
            >
              <div className="h-2 w-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-200">
                AI-Powered Learning Platform
              </span>
              <motion.div 
                className="ml-2 h-2 w-2 bg-indigo-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Master Competitive Exams with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
                Intelligent Preparation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Our adaptive learning platform uses advanced algorithms to create personalized study paths that maximize your efficiency and results.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 mb-10 justify-center lg:justify-start"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -3,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)'
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-200 text-sm"
                >
                  <span className="text-indigo-400">{feature.icon}</span>
                  {feature.text}
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl font-medium text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
                onClick={() => {
                  navigate('/login');
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)'
                }}
                className="bg-gradient-to-br from-gray-800/70 to-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex flex-col">
                  <motion.div 
                    className="mb-4 p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 w-fit group-hover:bg-indigo-500/30 transition-colors"
                    whileHover={{ rotate: 5 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-lg font-semibold text-indigo-300 mb-2">{stat.label}</p>
                  <p className="text-gray-300 text-sm">{stat.description}</p>
                </div>
                
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Exam badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:mt-12"
        >
          <p className="text-center text-gray-400 mb-6 text-lg">Supporting preparation for</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['JEE', 'NEET', 'UPSC', 'GATE', 'CAT', 'SSC', 'Banking', 'GRE', 'GMAT', 'CLAT'].map((exam, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(99, 102, 241, 0.3)',
                  color: '#fff'
                }}
                className="px-5 py-2.5 bg-gray-800/60 border border-gray-700 rounded-full text-sm font-medium text-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                {exam}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Chatbot Component */}
      <Chatbot />
    </section>
  );
};

export default Hero;