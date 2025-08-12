import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "JEE Advanced 2023 Qualifier",
    content: "Quality Edge Services helped me identify my weak areas systematically. Their AI analysis pinpointed exactly where I needed improvement, saving me countless hours of unproductive study.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "NEET 2023 Rank 1200",
    content: "The biology mock tests were incredibly close to the actual NEET exam. Practicing with their platform gave me the confidence and speed I needed on exam day.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "SSC CGL 2023 Selected",
    content: "As a working professional, I needed efficient preparation. Their smart test recommendations based on my available time and performance were a game-changer.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "GATE 2023 Top 100",
    content: "The quality of questions matched exactly with the actual GATE exam pattern. The performance analytics helped me optimize my preparation strategy.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/63.jpg"
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Bank PO Selected",
    content: "The sectional tests and time management strategies were invaluable. I improved my speed by 30% in just 2 months of practice.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/52.jpg"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Determine how many testimonials to show based on screen size
  const testimonialsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(testimonialsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(testimonialsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex + visibleCount >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - visibleCount : prevIndex - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex, 
    currentIndex + visibleCount
  );

  // If we're at the end and there aren't enough testimonials to fill the view,
  // take some from the beginning
  const wrappedTestimonials = 
    visibleTestimonials.length < visibleCount 
      ? [...visibleTestimonials, ...testimonials.slice(0, visibleCount - visibleTestimonials.length)]
      : visibleTestimonials;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section id="testimonials" className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Students Say
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Don't just take our word for it - hear from students who've achieved success with our platform.
          </motion.p>
        </div>
        
        <div 
          className="relative min-h-[400px] md:min-h-[350px] lg:min-h-[300px]"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              custom={direction}
            //   variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {wrappedTestimonials.map((testimonial) => (
                <motion.div 
                  key={testimonial.id}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-primary-300 transition-all h-full flex flex-col"
                  whileHover={{
                     y: -5, 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  <Quote className="text-primary-200 w-8 h-8 mb-4" />
                  
                  <p className="text-gray-600 mb-6 italic flex-grow">"{testimonial.content}"</p>
                  
                  <div className="flex items-center mt-auto">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm mr-4" 
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center mt-8 space-x-4">
          <motion.button 
            className="p-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft />
          </motion.button>
          
          <div className="flex items-center space-x-2 mx-4">
            {Array.from({ length: Math.ceil(testimonials.length / visibleCount) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${currentIndex >= index * visibleCount && currentIndex < (index + 1) * visibleCount ? 'bg-primary-600' : 'bg-gray-300'}`}
                onClick={() => setCurrentIndex(index * visibleCount)}
              />
            ))}
          </div>
          
          <motion.button 
            className="p-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;