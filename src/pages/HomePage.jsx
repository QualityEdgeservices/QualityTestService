import React from 'react'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import TestCards from '../components/TestCards';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
     <div className="bg-gray-50">
      <Hero />
      <About />
      <TestCards />
      <Stats />
      <Testimonials />
      <Contact />
    </div>
  )
}

export default HomePage
