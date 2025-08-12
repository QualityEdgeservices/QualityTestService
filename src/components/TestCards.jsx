import React from 'react';
import { BookText, School, GraduationCap, ClipboardList, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TestCards = () => {
  const exams = [
    {
      name: "SSC Exams",
      icon: <BookText className="text-primary-600" size={28} />,
      description: "Comprehensive preparation for all SSC exams including CGL, CHSL, MTS, and more.",
      tests: "10+ mock tests",
      color: "primary"
    },
    {
      name: "Engineering (JEE/GATE)",
      icon: <School className="text-secondary-600" size={28} />,
      description: "Targeted practice for JEE Main, Advanced, and GATE with previous year patterns.",
      tests: "10+ mock tests",
      color: "secondary"
    },
    {
      name: "Medical (NEET/AIIMS)",
      icon: <GraduationCap className="text-primary-600" size={28} />,
      description: "Biology-focused tests with NCERT-based questions and advanced level problems.",
      tests: "10+ mock tests",
      color: "primary"
    },
    {
      name: "Banking (IBPS/RBI)",
      icon: <ClipboardList className="text-secondary-600" size={28} />,
      description: "Quantitative aptitude, reasoning, and English tests designed for banking exams.",
      tests: "10+ mock tests",
      color: "secondary"
    }
  ];

  const navigate = useNavigate();
  const navigateToCategories = () => {
    navigate("/exam-test-series");
  }

   

  return (
    <section id="tests" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-primary-600">Exam</span> Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We cover all major competitive exams with regularly updated question banks and AI-powered analysis.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {exams.map((exam, index) => (
            <motion.div
              key={index}
              className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative z-10">
                <div className={`bg-${exam.color}-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {exam.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {exam.name}
                </h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base">
                  {exam.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="mr-2">📊</span>
                  <span>{exam.tests}</span>
                </div>
                <button className="flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors">
                  <span>Explore Tests</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-${exam.color}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <button className="relative overflow-hidden group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          onClick={ navigateToCategories}
          >
            <span className="relative z-10 flex items-center justify-center">
              View All Exam Categories
              <ArrowRight className="ml-2 h-5 w-5 transition-all group-hover:translate-x-1" />
            </span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-secondary-700 to-secondary-800 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestCards;