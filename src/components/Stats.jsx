import React from 'react';
import { Users, BookOpenCheck, Award, Clock4 } from 'lucide-react';

const Stats = () => {
  return (
    <section id="stats" className="py-16 bg-primary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-primary-200 max-w-3xl mx-auto">
            Join thousands of students who have transformed their exam preparation with our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-4xl font-bold mb-2">25+</h3>
            <p className="text-primary-200">Active Students</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenCheck className="text-white" size={32} />
            </div>
            <h3 className="text-4xl font-bold mb-2">10+</h3>
            <p className="text-primary-200">Mock Tests</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-4xl font-bold mb-2">30+</h3>
            <p className="text-primary-200">Successful Candidates</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock4 className="text-white" size={32} />
            </div>
            <h3 className="text-4xl font-bold mb-2">95%</h3>
            <p className="text-primary-200">Reported Time Improvement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;