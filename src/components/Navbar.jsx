import React, { useState, useEffect } from 'react';
import { BookOpen, Home, Info, Contact, BarChart2, Star, User, X, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "About", href: "#about", icon: <Info className="h-4 w-4" /> },
    { name: "Tests", href: "#tests", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Stats", href: "#stats", icon: <BarChart2 className="h-4 w-4" /> },
    { name: "Testimonials", href: "#testimonials", icon: <Star className="h-4 w-4" /> },
    { name: "Contact", href: "#contact", icon: <Contact className="h-4 w-4" /> }
  ];

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  console.log(user)

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.user);
        setUser(localStorage.getItem("token"));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthClick = () => {
    navigate('/login');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  // Listen for login events from other components
  useEffect(() => {
    const handleLogin = (event) => {
      if (event.detail && event.detail.user && event.detail.token) {
        setUser(event.detail.user);
        localStorage.setItem('token', event.detail.token);
      }
    };

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="" className='w-12 h-12' />
            <span className="md:text-xl text-lg font-bold text-primary-800">Quality Edge Services</span>
          </div>
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </div>
      </nav>
    );
  }

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
          
          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleDashboardClick}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-6 flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={handleAuthClick}
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </motion.button>
          )}
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
            
            {user ? (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-gray-700">{user.name}</span>
                </div>
                
                <button 
                  className="flex items-center space-x-2 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => {
                    handleDashboardClick();
                    setIsOpen(false);
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button 
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => {
                  handleAuthClick();
                  setIsOpen(false);
                }}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;