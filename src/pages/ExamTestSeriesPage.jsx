
import React, { useState, useEffect } from 'react';
import { BookText, Clock, Hash, Layers, Search, ArrowRight, FileText, Award, Shield, Banknote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { examAPI } from '../services/api';

const ExamTestSeriesPage = () => {
  const [allExams, setAllExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchExams();
  }, [currentPage]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getAllExams(currentPage, itemsPerPage);
      setAllExams(response.data.exams);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('Failed to fetch exams');
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await examAPI.searchExams(searchTerm, 1, itemsPerPage);
      setAllExams(response.data.exams);
      setTotalPages(response.data.totalPages);
      setCurrentPage(1);
    } catch (error) {
      setError('Search failed');
      console.error('Error searching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter exams based on search term (client-side fallback)
  const filteredExams = allExams.filter(exam => {
    return exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           exam.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const getExamIcon = (exam) => {
    switch (exam.name) {
      case 'SSC CGL':
      case 'SSC CHSL':
      case 'SSC JE':
      case 'RRB NTPC':
        return <FileText className="text-primary-600" size={24} />;
      case 'GATE CSE':
      case 'GATE EE':
      case 'NEET UG':
      case 'JEE Main':
        return <Award className="text-primary-600" size={24} />;
      case 'RBI Grade B':
      case 'IBPS PO':
        return <Banknote className="text-primary-600" size={24} />;
      case 'CRPF HC':
      case 'UPSC CAPF':
      case 'SSC GD':
      case 'UPSC CDS':
        return <Shield className="text-primary-600" size={24} />;
      case 'CTET':
      case 'UGC NET':
        return <BookText className="text-primary-600" size={24} />;
      default:
        return <FileText className="text-primary-600" size={24} />;
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 lg:py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exams...</p>
          </div>
        </div>
      </section>
    );
  }

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
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 bg-primary-600 hover:bg-primary-700 text-white p-1 rounded-md"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Exam Cards Grid */}
        {currentExams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {currentExams.map((exam, index) => (
                <motion.div
                  key={exam._id}
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
                      {getExamIcon(exam)}
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
                        <div className="text-lg font-semibold text-gray-800">{exam.chapterwise || 8}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Topicwise</div>
                        <div className="text-lg font-semibold text-gray-800">{exam.topicwise || 12}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Setwise</div>
                        <div className="text-lg font-semibold text-gray-800">{exam.setwise || 5}</div>
                      </div>
                    </div>
                    
                    {/* View Button */}
                    <button 
                      className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors group-hover:shadow-md"
                      onClick={() => window.location.href = `/exam-details/${exam._id}`}
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
            {totalPages > 1 && (
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