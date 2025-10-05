import React, { useState, useEffect } from 'react';
import { 
  BookText, Clock, Hash, Layers, Search, ArrowRight, FileText, 
  Award, Shield, Banknote, ChevronLeft, ChevronRight, Zap, Cpu, 
  Star, Users, BarChart3, Filter, X, Loader 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { examAPI } from '../services/api';

const ExamTestSeriesPage = () => {
  const [allExams, setAllExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const itemsPerPage = 12;

  // Exam categories for filtering
  const examCategories = [
    { id: 'all', name: 'All Exams' },
    { id: 'engineering', name: 'Engineering', exams: ['GATE CSE', 'GATE EE', 'JEE Main'] },
    { id: 'medical', name: 'Medical', exams: ['NEET', 'NEET UG'] },
    { id: 'ssc', name: 'SSC', exams: ['SSC CGL', 'SSC CHSL', 'SSC JE', 'SSC GD'] },
    { id: 'banking', name: 'Banking', exams: ['RBI Grade B', 'IBPS PO'] },
    { id: 'defense', name: 'Defense', exams: ['CRPF HC', 'UPSC CAPF', 'UPSC CDS'] },
    { id: 'teaching', name: 'Teaching', exams: ['CTET', 'UGC NET'] }
  ];

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

  // Filter exams based on search term and selected filters
  const filteredExams = allExams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      const category = examCategories.find(cat => cat.id === selectedCategory);
      matchesCategory = category.exams.includes(exam.name);
    }
    
    const matchesPrice = exam.price >= priceRange[0] && exam.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Calculate category counts for display
  const getCategoryCounts = (exam) => {
    const setwiseCount = exam.categories?.["Set Wise"]?.length || 0;
    const subjectwiseCount = exam.categories?.["Subject Wise"]?.length || 0;
    const topicwiseCount = exam.categories?.["Topic Wise"]?.length || 0;
    
    return {
      setwise: setwiseCount,
      subjectwise: subjectwiseCount,
      topicwise: topicwiseCount
    };
  };

  const getExamIcon = (exam) => {
    if (exam.icon) {
      switch (exam.icon) {
        case 'FileText': return <FileText size={24} />;
        case 'Award': return <Award size={24} />;
        case 'Banknote': return <Banknote size={24} />;
        case 'Shield': return <Shield size={24} />;
        case 'BookText': return <BookText size={24} />;
        case 'Zap': return <Zap size={24} />;
        case 'Cpu': return <Cpu size={24} />;
        case 'Layers': return <Layers size={24} />;
        default: return <FileText size={24} />;
      }
    }
    
    switch (exam.name) {
      case 'SSC CGL':
      case 'SSC CHSL':
      case 'SSC JE':
      case 'RRB NTPC':
        return <FileText size={24} />;
      case 'GATE CSE':
      case 'GATE EE':
      case 'NEET UG':
      case 'JEE Main':
      case 'NEET':
        return <Award size={24} />;
      case 'RBI Grade B':
      case 'IBPS PO':
        return <Banknote size={24} />;
      case 'CRPF HC':
      case 'UPSC CAPF':
      case 'SSC GD':
      case 'UPSC CDS':
        return <Shield size={24} />;
      case 'CTET':
      case 'UGC NET':
        return <BookText size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  // Get color class based on exam color
  const getColorClass = (exam) => {
    switch (exam.color) {
      case 'primary': return 'primary';
      case 'secondary': return 'secondary';
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'tertiary': return 'tertiary';
      default: return 'primary';
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <section className="min-h-screen py-16 md:py-20 lg:py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-16">
            <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading exams...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-16 md:py-20 lg:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Explore Our <span className="text-primary-600">Exam Test Series</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive test series for all major government and competitive examinations with detailed analytics and performance tracking
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search exams by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>

              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div 
              className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Exam Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {examCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
              {currentExams.map((exam, index) => {
                const categoryCounts = getCategoryCounts(exam);
                const colorClass = getColorClass(exam);
                
                return (
                  <motion.div
                    key={exam._id}
                    className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary-200 transition-all duration-300 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative z-10">
                      {/* Exam Icon and Price */}
                      <div className="flex justify-between items-start mb-4">
                        <div className={`bg-${colorClass}-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          {React.cloneElement(getExamIcon(exam), { className: `text-${colorClass}-600` })}
                        </div>
                        <div className="bg-gray-100 rounded-lg px-3 py-1">
                          {/* <span className="font-semibold text-gray-800">₹{exam.price}</span> */}
                          <span className="font-semibold text-gray-800">₹ 0</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                        {exam.name}
                      </h3>
                      <p className="text-gray-600 mb-5 text-sm md:text-base line-clamp-2">
                        {exam.description}
                      </p>
                      
                      {/* Test Counts */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Total Tests</div>
                          <div className="text-lg font-bold text-gray-800">{exam.totalTests}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Subjectwise</div>
                          <div className="text-lg font-bold text-gray-800">{categoryCounts.subjectwise}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Topicwise</div>
                          <div className="text-lg font-bold text-gray-800">{categoryCounts.topicwise}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Setwise</div>
                          <div className="text-lg font-bold text-gray-800">{categoryCounts.setwise}</div>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="mb-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock size={14} className="mr-2" />
                          <span>{exam.duration}</span>
                        </div>
                        {/* <div className="flex items-center text-sm text-gray-500">
                          <Star size={14} className="mr-2 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (120 reviews)</span>
                        </div> */}
                      </div>
                      
                      {/* View Button */}
                      <button 
                        className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium transition-colors group-hover:shadow-md"
                        onClick={() => window.location.href = `/exam-details/${exam._id}`}
                      >
                        <span>View Test Series</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-${colorClass}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </motion.div>
                );
              })}
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
                <nav className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${currentPage === number ? 'bg-primary-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronRight size={20} />
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
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No exams found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
            <button
              onClick={resetFilters}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

      
      </div>
    </section>
  );
};

export default ExamTestSeriesPage;