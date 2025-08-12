import React, { useState } from 'react';
import { BookText, Clock, Hash, Layers, Search, ArrowRight, FileText, Award, Shield, Banknote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamTestSeriesPage = () => {
  // Sample exam data (expanded to more than 12 items)
  const allExams = [
    {
      id: 1,
      name: "SSC CGL",
      icon: <FileText className="text-primary-600" size={24} />,
      totalTests: 15,
      chapterwise: 8,
      topicwise: 12,
      setwise: 5,
      description: "Complete test series for SSC Combined Graduate Level Examination",
      color: "primary"
    },
    {
      id: 2,
      name: "SSC CHSL",
      icon: <FileText className="text-secondary-600" size={24} />,
      totalTests: 12,
      chapterwise: 6,
      topicwise: 9,
      setwise: 4,
      description: "Comprehensive preparation for SSC CHSL (10+2) Examination",
      color: "secondary"
    },
    {
      id: 3,
      name: "GATE CSE",
      icon: <Award className="text-primary-600" size={24} />,
      totalTests: 20,
      chapterwise: 10,
      topicwise: 15,
      setwise: 8,
      description: "GATE Computer Science Engineering test series with previous year patterns",
      color: "primary"
    },
    {
      id: 4,
      name: "GATE EE",
      icon: <Award className="text-secondary-600" size={24} />,
      totalTests: 18,
      chapterwise: 9,
      topicwise: 14,
      setwise: 7,
      description: "Electrical Engineering test series for GATE examination",
      color: "secondary"
    },
    {
      id: 5,
      name: "RBI Grade B",
      icon: <Banknote className="text-primary-600" size={24} />,
      totalTests: 10,
      chapterwise: 5,
      topicwise: 8,
      setwise: 3,
      description: "Specialized test series for RBI Grade B Officer recruitment",
      color: "primary"
    },
    {
      id: 6,
      name: "CRPF HC",
      icon: <Shield className="text-secondary-600" size={24} />,
      totalTests: 8,
      chapterwise: 4,
      topicwise: 6,
      setwise: 2,
      description: "Test series for CRPF Head Constable (Ministerial) examination",
      color: "secondary"
    },
    {
      id: 7,
      name: "IBPS PO",
      icon: <Banknote className="text-primary-600" size={24} />,
      totalTests: 12,
      chapterwise: 6,
      topicwise: 10,
      setwise: 4,
      description: "Probationary Officer test series with sectional and full mocks",
      color: "primary"
    },
    {
      id: 8,
      name: "UPSC CAPF",
      icon: <Shield className="text-secondary-600" size={24} />,
      totalTests: 10,
      chapterwise: 5,
      topicwise: 8,
      setwise: 3,
      description: "Central Armed Police Forces Assistant Commandant exam preparation",
      color: "secondary"
    },
    {
      id: 9,
      name: "SSC JE",
      icon: <FileText className="text-primary-600" size={24} />,
      totalTests: 14,
      chapterwise: 7,
      topicwise: 11,
      setwise: 6,
      description: "Junior Engineer test series for Civil, Mechanical and Electrical",
      color: "primary"
    },
    {
      id: 10,
      name: "RRB NTPC",
      icon: <FileText className="text-secondary-600" size={24} />,
      totalTests: 16,
      chapterwise: 8,
      topicwise: 12,
      setwise: 5,
      description: "Non-Technical Popular Categories exam preparation",
      color: "secondary"
    },
    {
      id: 11,
      name: "SSC GD",
      icon: <Shield className="text-primary-600" size={24} />,
      totalTests: 9,
      chapterwise: 5,
      topicwise: 7,
      setwise: 3,
      description: "General Duty Constable test series with physical standards guide",
      color: "primary"
    },
    {
      id: 12,
      name: "UPSC CDS",
      icon: <Shield className="text-secondary-600" size={24} />,
      totalTests: 11,
      chapterwise: 6,
      topicwise: 9,
      setwise: 4,
      description: "Combined Defence Services examination test series",
      color: "secondary"
    },
    {
      id: 13,
      name: "NEET UG",
      icon: <Award className="text-primary-600" size={24} />,
      totalTests: 25,
      chapterwise: 12,
      topicwise: 18,
      setwise: 10,
      description: "Medical entrance examination comprehensive test series",
      color: "primary"
    },
    {
      id: 14,
      name: "JEE Main",
      icon: <Award className="text-secondary-600" size={24} />,
      totalTests: 22,
      chapterwise: 11,
      topicwise: 16,
      setwise: 9,
      description: "Engineering entrance test series with previous year papers",
      color: "secondary"
    },
    {
      id: 15,
      name: "CTET",
      icon: <BookText className="text-primary-600" size={24} />,
      totalTests: 8,
      chapterwise: 4,
      topicwise: 6,
      setwise: 2,
      description: "Central Teacher Eligibility Test preparation series",
      color: "primary"
    },
    {
      id: 16,
      name: "UGC NET",
      icon: <BookText className="text-secondary-600" size={24} />,
      totalTests: 15,
      chapterwise: 8,
      topicwise: 12,
      setwise: 5,
      description: "National Eligibility Test for college lecturers",
      color: "secondary"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter exams based on search term
  const filteredExams = allExams.filter(exam => {
    return exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           exam.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <section className="py-16 md:py-20 lg:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            All <span className="text-primary-600">Exam Test Series</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive test series for all major government and competitive examinations
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full md:w-96 mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search exams by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
        </motion.div>

        {/* Exam Cards Grid */}
        {currentExams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {currentExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative z-10">
                    {/* Exam Icon */}
                    <div className={`bg-${exam.color}-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {exam.icon}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {exam.name}
                    </h3>
                    <p className="text-gray-600 mb-5 text-sm md:text-base">
                      {exam.description}
                    </p>
                    
                    {/* Test Counts */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Total Tests</div>
                        <div className="text-lg font-semibold text-gray-800">{exam.totalTests}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Chapterwise</div>
                        <div className="text-lg font-semibold text-gray-800">{exam.chapterwise}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Topicwise</div>
                        <div className="text-lg font-semibold text-gray-800">{exam.topicwise}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Setwise</div>
                        <div className="text-lg font-semibold text-gray-800">{exam.setwise}</div>
                      </div>
                    </div>
                    
                    {/* View Button */}
                    <button className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors group-hover:shadow-md"
                    onClick={() => window.location.href = `/exam-details/${exam.id}`}
                    >
                      <span>View Test Series</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-${exam.color}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {filteredExams.length > itemsPerPage && (
              <motion.div 
                className="flex justify-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <nav className="flex items-center gap-1">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${currentPage === number ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No exams found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search criteria to find what you're looking for.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExamTestSeriesPage;