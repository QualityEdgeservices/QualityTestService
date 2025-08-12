import React, { useEffect, useRef } from 'react';
import { Rocket, BrainCircuit, BarChart2, Zap, ArrowRight, Award, Clock, BookOpen } from 'lucide-react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Hero = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeFeature, setActiveFeature] = React.useState(null);
  const examCarouselRef = useRef(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const carousel = examCarouselRef.current;
    if (!carousel) return;

    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    let direction = 1;
    let position = 0;

    const animate = () => {
      position += direction * 0.5;
      
      if (position >= scrollWidth - clientWidth) {
        direction = -1;
      } else if (position <= 0) {
        direction = 1;
      }
      
      carousel.scrollLeft = position;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const features = [
    {
      id: 1,
      icon: <BrainCircuit className="text-indigo-500" size={28} />,
      title: "AI-Powered Insights",
      description: "Get real-time analysis of your strengths and weaknesses",
      color: "from-indigo-600/20 to-indigo-600/10",
      bgColor: "bg-indigo-600/30",
      extendedDesc: "Our advanced AI analyzes every answer to provide personalized recommendations for improvement, tracking 37 different performance metrics."
    },
    {
      id: 2,
      icon: <BarChart2 className="text-teal-500" size={28} />,
      title: "Smart Progress Tracking",
      description: "Visualize your improvement with detailed analytics",
      color: "from-teal-600/20 to-teal-600/10",
      bgColor: "bg-teal-600/30",
      extendedDesc: "Interactive dashboards show your progress across all subjects, with predictive scoring based on historical performance data."
    },
    {
      id: 3,
      icon: <Zap className="text-amber-500" size={28} />,
      title: "Adaptive Learning",
      description: "Tests that automatically adjust to your skill level",
      color: "from-amber-600/20 to-amber-600/10",
      bgColor: "bg-amber-600/30",
      extendedDesc: "The system dynamically adjusts question difficulty based on your responses, focusing on areas that need the most attention."
    },
    {
      id: 4,
      icon: <Award className="text-purple-500" size={28} />,
      title: "Expert Curated",
      description: "Content designed by top educators and exam toppers",
      color: "from-purple-600/20 to-purple-600/10",
      bgColor: "bg-purple-600/30",
      extendedDesc: "Our question bank is developed by IIT/NIT alumni and exam toppers, with detailed explanations for every concept."
    },
    {
      id: 5,
      icon: <Clock className="text-cyan-500" size={28} />,
      title: "Time Management",
      description: "Practice with realistic exam timers and pacing",
      color: "from-cyan-600/20 to-cyan-600/10",
      bgColor: "bg-cyan-600/30",
      extendedDesc: "Simulate real exam conditions with our intelligent timing system that helps you optimize your question-solving strategy."
    },
    {
      id: 6,
      icon: <BookOpen className="text-emerald-500" size={28} />,
      title: "Comprehensive Resources",
      description: "Access to 10,000+ questions and solutions",
      color: "from-emerald-600/20 to-emerald-600/10",
      bgColor: "bg-emerald-600/30",
      extendedDesc: "Massive repository covering all exam patterns with regularly updated content aligned with the latest syllabi."
    }
  ];

  const examTypes = [
    "SSC", "GATE", "JEE", "NEET", "UPSC", "CAT", "Banking", "GRE",
    "GMAT", "CLAT", "NDA", "CDS", "AFCAT", "Railways", "State PSCs"
  ];

  // Floating 3D sphere component
  const FloatingSphere = () => {
    const meshRef = useRef();
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.01;
        const time = state.clock.getElapsedTime();
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      }
    });

    return (
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.8}
        />
      </Sphere>
    );
  };

  return (
   <section 
  ref={ref}
  className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700"
>
      {/* Interactive particle background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <Canvas
          style={{ position: "absolute", zIndex: -1 }}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <FloatingSphere />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
        
        {[...Array(120)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: Math.random() * 30 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-20 container mx-auto px-4 h-full flex items-center pt-20 pb-28">

        <div className="grid lg:grid-cols-2 gap-12 items-center border-red-500">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={controls}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-700 border border-gray-600 mb-6"
            >
              <Rocket className="h-5 w-5 text-amber-400 mr-2" />
              <span className="text-sm font-medium text-gray-100">
                The Future of Exam Preparation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
                Revolutionizing
              </span>{" "}
              Competitive Exam Prep
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Our AI-powered platform adapts to your learning style, providing personalized mock tests and detailed analytics to help you outperform 90% of candidates.
            </motion.p>

            {/* Exam badges carousel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-10 overflow-hidden"
            >
              <div 
                ref={examCarouselRef}
                className="flex gap-3 py-2 overflow-x-auto scrollbar-hide"
              >
                {examTypes.map((exam, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05, type: 'spring' }}
                    className="flex-shrink-0 px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-full text-sm font-medium text-gray-100 hover:bg-gray-600 transition-colors"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: 'rgba(99, 102, 241, 0.5)'
                    }}
                  >
                    {exam}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.7)'
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all"
              >
                <span className="relative z-10 flex items-center">
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(165, 180, 252, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-500 hover:border-indigo-400 rounded-lg font-medium text-white hover:text-indigo-300 transition-all hover:shadow-lg"
              >
                Explore All Features
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              className="mt-12 flex flex-col sm:flex-row items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.img
                      key={i}
                      src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-gray-700"
                      initial={{ x: -10 * i, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      whileHover={{ zIndex: 10, scale: 1.2 }}
                    />
                  ))}
                </div>
                <div className="ml-4 text-left">
                  <p className="text-sm font-medium text-gray-100">Trusted by 250,000+ students</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs text-gray-200 ml-2">4.9/5 (3,458 reviews)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={controls}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 relative z-100"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                custom={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => setActiveFeature(feature)}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-gray-600 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer`}
                layout
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor} border border-gray-600 shadow-sm`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-100 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Feature detail overlay */}
            <AnimatePresence>
              {activeFeature && (
                <motion.div 
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveFeature(null)}
                >
                  <motion.div 
                    className={`max-w-md w-full rounded-2xl p-8 ${activeFeature.bgColor} border border-gray-500 backdrop-blur-lg`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    layoutId={`feature-${activeFeature.id}`}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`p-3 rounded-lg ${activeFeature.bgColor} border border-gray-500`}>
                        {activeFeature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {activeFeature.title}
                      </h3>
                    </div>
                    <p className="text-gray-100 mb-6">
                      {activeFeature.extendedDesc}
                    </p>
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-white/20 border border-gray-300 rounded-lg text-white"
                        onClick={() => setActiveFeature(null)}
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-300 cursor-pointer group"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm mb-2 group-hover:text-indigo-300 transition-colors">Scroll to Explore</span>
          <div className="w-10 h-16 border-2 border-gray-400 rounded-full flex justify-center p-1 group-hover:border-indigo-400 transition-colors">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-gray-300 rounded-full group-hover:bg-indigo-400 transition-colors"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Star icon component
const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export default Hero;