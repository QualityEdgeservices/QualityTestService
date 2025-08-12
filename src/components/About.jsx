import React from 'react';
import { Target, BrainCircuit, BarChart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Target className="text-primary-600" size={28} />,
    title: "Focused Preparation",
    description: "Customized tests targeting your weak areas for maximum improvement.",
    bgColor: "bg-primary-100",
    delay: 0.1
  },
  {
    icon: <BrainCircuit className="text-secondary-600" size={28} />,
    title: "AI-Powered Analysis",
    description: "Smart algorithms identify patterns in your performance to guide your study.",
    bgColor: "bg-secondary-100",
    delay: 0.2
  },
  {
    icon: <BarChart className="text-primary-600" size={28} />,
    title: "Detailed Reports",
    description: "Comprehensive performance metrics to track your progress over time.",
    bgColor: "bg-primary-100",
    delay: 0.3
  },
  {
    icon: <ShieldCheck className="text-secondary-600" size={28} />,
    title: "Quality Assurance",
    description: "All content verified by subject matter experts and toppers.",
    bgColor: "bg-secondary-100",
    delay: 0.4
  }
];

const About = () => {
  return (
    <section id="about" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            About <span className="text-primary-600">Quality Edge</span> Services
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            We transform exam preparation through cutting-edge technology and data-driven insights, helping students achieve their academic dreams.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-white p-6 sm:p-7 lg:p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-primary-200 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative z-10">
                <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default About;