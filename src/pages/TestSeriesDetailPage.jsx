import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookText, Clock, Hash, ArrowRight, FileText, Award, Shield, Banknote, ChevronLeft, Trophy, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { examAPI, testAPI } from '../services/api';
import { AlertCircle } from 'lucide-react';

const TestSeriesDetailPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [examData, setExamData] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Tests");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getExamDetail(examId);
      console.log('Fetched exam details:', response.data);
      setExamData(response.data);
    } catch (error) {
      setError('Failed to load exam details');
      console.error('Error fetching exam details:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (test) => {
    try {
      const response = await testAPI.startTest(test._id);
      navigate(`/mock-test/${examId}/${test._id}`);
    } catch (error) {
      setError('Failed to start test');
      console.error('Error starting test:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exam details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!examData || !examData.exam) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Exam not found</h2>
            <p className="text-gray-600">The requested exam could not be found.</p>
            <Link to="/exam-test-series" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Back to All Exams
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { exam, tests, testcounts, totalTests, summary } = examData;

  const getExamIcon = () => {
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

  // Get tests based on active category
  const getTestsForCategory = () => {
    if (activeCategory === "All Tests") {
      return tests || [];
    }
    
    // Check if we have breakdown data for the category
    if (examData.breakdown && examData.breakdown[activeCategory.toLowerCase().replace(' ', '')]) {
      return examData.breakdown[activeCategory.toLowerCase().replace(' ', '')];
    }
    
    // Fallback to filtering tests by category field
    return (tests || []).filter(test => 
      test.category && test.category === activeCategory
    );
  };

  // Generate category tabs based on available data
  const getCategoryTabs = () => {
    const categories = ["All Tests"];
    
    // Add categories from testcounts if available
    if (testcounts) {
      Object.keys(testcounts).forEach(category => {
        if (testcounts[category] > 0 && !categories.includes(category)) {
          categories.push(category);
        }
      });
    }
    
    // Also add any unique categories from tests
    if (tests) {
      tests.forEach(test => {
        if (test.category && !categories.includes(test.category)) {
          categories.push(test.category);
        }
      });
    }
    
    return categories;
  };

  // Get test count for a category
  const getTestCount = (category) => {
    if (category === "All Tests") return totalTests || (tests ? tests.length : 0);
    
    if (testcounts && testcounts[category] !== undefined) {
      return testcounts[category];
    }
    
    return 0;
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <Link 
            to="/exam-test-series" 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to All Test Series
          </Link>
        </motion.div>

        {/* Exam Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-primary-50 w-14 h-14 rounded-xl flex items-center justify-center mr-4">
              {getExamIcon()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{exam.name} Test Series</h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center">
            <span>Buy Now for ₹{exam.price}</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>

        {/* Exam Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className="bg-primary-50 p-2 rounded-lg mr-3">
                <Hash className="text-primary-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Tests</div>
                <div className="text-xl font-semibold text-gray-800">{totalTests || (tests ? tests.length : 0)}</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className="bg-primary-50 p-2 rounded-lg mr-3">
                <Clock className="text-primary-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Test Duration</div>
                <div className="text-xl font-semibold text-gray-800">{exam.duration || 'Varies'}</div>
              </div>
            </div>
          </motion.div>
          
          {/* <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className="bg-primary-50 p-2 rounded-lg mr-3">
                <Trophy className="text-primary-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-xl font-semibold text-gray-800">
                  {exam.lastUpdated ? new Date(exam.lastUpdated).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long'
                  }) : 'Recently'}
                </div>
              </div>
            </div>
          </motion.div> */}
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className="bg-primary-50 p-2 rounded-lg mr-3">
                <BarChart2 className="text-primary-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Free Tests</div>
                <div className="text-xl font-semibold text-gray-800">
                  {summary && summary.freeTests ? summary.freeTests : (tests ? tests.filter(t => t.isFree).length : 0)}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features and Test Categories */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Features */}
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
              <ul className="space-y-3">
                {exam.features && exam.features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                      <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                  Start Free Trial (3 Tests)
                </button>
                <button className="w-full mt-4 bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 py-3 rounded-lg font-medium transition-colors">
                  View Syllabus
                </button>
              </div>
            </div>
          </motion.div>

          {/* Test Categories */}
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-2 mb-6">
              {getCategoryTabs().map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category} ({getTestCount(category)})
                </button>
              ))}
            </div>

            {/* Tests List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {getTestsForCategory().length > 0 ? (
                getTestsForCategory().map((test, index) => {
                  const testName = test.title || test.name;
                  const questionCount = test.questions ? test.questions.length : test.totalQuestions || 0;
                  const isFree = test.isFree || false;

                  return (
                    <motion.div
                      key={test._id || index}
                      className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-3 sm:mb-0">
                          <h3 className="text-lg font-medium text-gray-800">{testName}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <span className="flex items-center mr-4">
                              <Hash className="h-4 w-4 mr-1" />
                              {questionCount} Questions
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.duration || 'N/A'} mins
                            </span>
                          </div>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            isFree
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50'
                          }`}
                          onClick={() => {
                            if (isFree) {
                              startTest(test);
                            } else {
                              navigate(`/test-details/${examId}/${test._id}`);
                            }
                          }}
                        >
                          {isFree ? 'Start Test' : 'View Details'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic p-4">No tests available in this category</p>
              )}
            </div>

            {/* Test Instructions */}
            <motion.div 
              className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Instructions</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
                  </div>
                  <span>All tests are timed and must be completed in one session</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
                  </div>
                  <span>You can pause and resume tests within the allowed time frame</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
                  </div>
                  <span>Detailed solutions are available after test completion</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
                  </div>
                  <span>Performance analytics will help you identify weak areas</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestSeriesDetailPage;