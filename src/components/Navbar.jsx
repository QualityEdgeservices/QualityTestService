import React, { useState } from 'react';
import { BookOpen, Home, Info, Contact, BarChart2, Star, User, X, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 
import { Link , useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "About", href: "#about", icon: <Info className="h-4 w-4" /> },
    { name: "Tests", href: "#tests", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Stats", href: "#stats", icon: <BarChart2 className="h-4 w-4" /> },
    { name: "Testimonials", href: "#testimonials", icon: <Star className="h-4 w-4" /> },
    { name: "Contact", href: "#contact", icon: <Contact className="h-4 w-4" /> }
  ];
  const handleAuthClick = () => {
    navigate('/login'); // Redirect to login page
  };


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="" className='w-12 h-12' />
          <span className="md:text-xl text-lg font-bold text-primary-800">Quality Edge Services</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="flex items-center text-gray-700 hover:text-primary-600 transition-colors group"
              >
                <span className="mr-1 group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-6 flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={handleAuthClick}
          >
            <User className="h-4 w-4" />
            <span>Login</span>
          </motion.button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-white border-t border-gray-200"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center text-gray-700 hover:text-primary-600 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">
                  {link.icon}
                </span>
                {link.name}
              </a>
            ))}
            
            <button className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg mt-2 transition-colors w-max"
              onClick={handleAuthClick}>
              <User className="h-4 w-4" />
              <span>Login</span>
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;