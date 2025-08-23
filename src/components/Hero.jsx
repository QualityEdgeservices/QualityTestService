import React from 'react';
import { Target, Users, TrendingUp, Clock, ChevronRight, Star, BookOpen, Award, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
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
      value: "250K+",
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
              >
                <span className="relative z-10 flex items-center justify-center">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(165, 180, 252, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border-2 border-gray-600 hover:border-indigo-400 rounded-xl font-medium text-white hover:text-indigo-300 transition-all duration-300 hover:shadow-lg bg-gray-800/40 backdrop-blur-sm"
              >
                View Demo
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

      {/* Animated scroll indicator */}
     <motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ delay: 1.4 }}
  viewport={{ once: true }}
  className="absolute bottom-12 left-0 right-0 flex justify-center z-30"
>
  {/* <motion.div
    animate={{ y: [0, 12, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="flex flex-col items-center text-gray-400 cursor-pointer group"
    whileHover={{ scale: 1.1 }}
  >
    <span className="text-sm mb-2 group-hover:text-indigo-300 transition-colors">
      Discover Features
    </span>
    <div className="w-10 h-16 border-2 border-gray-600 rounded-full flex justify-center p-1 group-hover:border-indigo-500 transition-colors">
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-3 h-3 bg-gray-500 rounded-full group-hover:bg-indigo-500 transition-colors"
      />
    </div>
  </motion.div> */}
</motion.div>

    </section>
  );
};

export default Hero;