import React, { useState } from 'react';
import { BookText, School, GraduationCap, ClipboardList, ArrowRight, Clock, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TestCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const exams = [
    {
      name: "SSC Exams",
      icon: <BookText size={28} />,
      description: "Comprehensive preparation for all SSC exams including CGL, CHSL, MTS, and more.",
      tests: "10+ mock tests",
      questions: "5000+ questions",
      duration: "60-120 mins",
      students: "50K+ students",
      color: "primary",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Engineering (JEE/GATE)",
      icon: <School size={28} />,
      description: "Targeted practice for JEE Main, Advanced, and GATE with previous year patterns.",
      tests: "12+ mock tests",
      questions: "6500+ questions",
      duration: "90-180 mins",
      students: "45K+ students",
      color: "secondary",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      name: "Medical (NEET/AIIMS)",
      icon: <GraduationCap size={28} />,
      description: "Biology-focused tests with NCERT-based questions and advanced level problems.",
      tests: "15+ mock tests",
      questions: "7000+ questions",
      duration: "90-180 mins",
      students: "65K+ students",
      color: "primary",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      name: "Banking (IBPS/RBI)",
      icon: <ClipboardList size={28} />,
      description: "Quantitative aptitude, reasoning, and English tests designed for banking exams.",
      tests: "8+ mock tests",
      questions: "4500+ questions",
      duration: "60-120 mins",
      students: "40K+ students",
      color: "secondary",
      gradient: "from-violet-500 to-purple-600"
    }
  ];

  const navigate = useNavigate();
  const navigateToCategories = () => {
    navigate("/exam-test-series");
  }

  return (
    <section id="tests" className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">Exam</span> Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We cover all major competitive exams with regularly updated question banks and AI-powered analysis.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {exams.map((exam, index) => (
            <motion.div
              key={index}
              className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10, scale: 1.02 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient background overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${exam.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Animated border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${exam.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 p-px -m-px`}>
                <div className="absolute inset-0 bg-white rounded-2xl"></div>
              </div>
              
              <div className="relative z-10">
                {/* Icon with animated gradient background */}
                <motion.div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${exam.gradient} text-white shadow-md`}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {exam.icon}
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {exam.name}
                </h3>
                
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">
                  {exam.description}
                </p>
                
                {/* Stats section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <BarChart3 size={16} className="mr-2 text-primary-500" />
                    <span>{exam.tests}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookText size={16} className="mr-2 text-primary-500" />
                    <span>{exam.questions}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-2 text-primary-500" />
                    <span>{exam.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-2 text-primary-500" />
                    <span>{exam.students}</span>
                  </div>
                </div>
                
                {/* Button with enhanced hover effect */}
                <motion.button 
                  className="flex items-center font-medium text-gray-700 hover:text-primary-700 transition-colors group/btn"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary-600 after:transition-all after:duration-300 group-hover/btn:after:w-full">
                    Explore Tests
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </motion.button>
              </div>
              
              {/* Floating particles effect on hover */}
              {hoveredCard === index && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary-500 opacity-30"
                      initial={{ 
                        opacity: 0,
                        scale: 0,
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50
                      }}
                      animate={{ 
                        opacity: [0, 0.3, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="relative overflow-hidden group bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-500 shadow-lg hover:shadow-xl flex items-center mx-auto"
            onClick={navigateToCategories}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              View All Exam Categories
              <ArrowRight className="ml-2 h-5 w-5 transition-all group-hover:translate-x-1" />
            </span>
            
            {/* Animated gradient background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-secondary-600 via-secondary-700 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 100%"
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestCards;