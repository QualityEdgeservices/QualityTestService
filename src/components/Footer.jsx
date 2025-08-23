import React from "react";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  return (
    <section id="footer_btm" className="bg-gray-900 text-white py-6">
      <footer className="text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-400">
            Copyright &copy; {new Date().getFullYear()} | QualityEdge Services
            Private Limited | CIN: U82990WB2023PTC260361 All Rights Reserved
          </p>
        </div>

       
      </footer>
    </section>
  );
};

export default Footer;
