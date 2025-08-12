import React from "react";
import { Facebook, Linkedin, Instagram, Youtube } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 sm:flex sm:flex-col hidden">
           <img src={logo} alt="" className="w-12 h-12 mb-2" />
            <p className="text-gray-400 text-sm mt-1">
              Smart test preparation for competitive exams
            </p>
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Youtube size={18} />
            </a>

            <a href="#" className="text-gray-400 hover:text-white transition">
              <Instagram size={18} />
            </a>
          </div>

          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} QualityEdge Services Pvt. Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
