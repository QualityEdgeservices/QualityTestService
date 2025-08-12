import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookText, Clock, Hash, Layers, ArrowRight, FileText, Award, Shield, Banknote, ChevronLeft, ChevronRight, BookOpen, List, Grid, Trophy, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TestSeriesDetailPage = () => {
  const { examId } = useParams();
  
  // Sample data for all exams
  const examDetails = {
    1: {
      id: 1,
      name: "SSC CGL",
      icon: <FileText className="text-primary-600" size={24} />,
      description: "Complete test series for SSC Combined Graduate Level Examination",
      color: "primary",
      totalTests: 15,
      duration: "60-120 minutes per test",
      price: "₹999",
      lastUpdated: "June 2023",
      features: [
        "Based on latest SSC CGL pattern",
        "Detailed solutions & explanations",
        "Performance analysis",
        "Previous year question patterns",
        "Sectional time management practice"
      ],
      categories: {
        "Set Wise": [
          { id: 1, name: "Full Length Mock Test 1", questions: 100, duration: "120 min" },
          { id: 2, name: "Full Length Mock Test 2", questions: 100, duration: "120 min" },
          { id: 3, name: "Previous Year Pattern 2022", questions: 100, duration: "120 min" },
          { id: 4, name: "Previous Year Pattern 2021", questions: 100, duration: "120 min" },
          { id: 5, name: "Tier I Practice Set", questions: 100, duration: "60 min" }
        ],
        "Subject Wise": [
          { id: 6, name: "Quantitative Aptitude", questions: 25, duration: "60 min" },
          { id: 7, name: "English Language", questions: 25, duration: "60 min" },
          { id: 8, name: "General Awareness", questions: 25, duration: "20 min" },
          { id: 9, name: "Logical Reasoning", questions: 25, duration: "60 min" }
        ],
        "Topic Wise": [
          { id: 10, name: "Number System", questions: 20, duration: "30 min" },
          { id: 11, name: "Percentage & Ratio", questions: 20, duration: "30 min" },
          { id: 12, name: "Geometry", questions: 20, duration: "30 min" },
          { id: 13, name: "Vocabulary", questions: 20, duration: "20 min" },
          { id: 14, name: "Grammar", questions: 20, duration: "20 min" },
          { id: 15, name: "Current Affairs", questions: 20, duration: "15 min" }
        ]
      }
    },
    2: {
      id: 2,
      name: "SSC CHSL",
      icon: <FileText className="text-secondary-600" size={24} />,
      description: "Comprehensive preparation for SSC CHSL (10+2) Examination",
      color: "secondary",
      totalTests: 12,
      duration: "60-90 minutes per test",
      price: "₹899",
      lastUpdated: "May 2023",
      features: [
        "Based on latest SSC CHSL pattern",
        "Detailed solutions & explanations",
        "Performance analysis",
        "Previous year question patterns",
        "Sectional time management practice"
      ],
      categories: {
        "Set Wise": [
          { id: 1, name: "Full Length Mock Test 1", questions: 100, duration: "90 min" },
          { id: 2, name: "Full Length Mock Test 2", questions: 100, duration: "90 min" },
          { id: 3, name: "Previous Year Pattern 2022", questions: 100, duration: "90 min" },
          { id: 4, name: "Tier I Practice Set", questions: 100, duration: "60 min" }
        ],
        "Subject Wise": [
          { id: 5, name: "Quantitative Aptitude", questions: 25, duration: "60 min" },
          { id: 6, name: "English Language", questions: 25, duration: "60 min" },
          { id: 7, name: "General Awareness", questions: 25, duration: "20 min" },
          { id: 8, name: "Logical Reasoning", questions: 25, duration: "60 min" }
        ],
        "Topic Wise": [
          { id: 9, name: "Basic Arithmetic", questions: 20, duration: "30 min" },
          { id: 10, name: "Algebra", questions: 20, duration: "30 min" },
          { id: 11, name: "Vocabulary", questions: 20, duration: "20 min" },
          { id: 12, name: "Grammar", questions: 20, duration: "20 min" }
        ]
      }
    },
    3: {
      id: 3,
      name: "GATE CSE",
      icon: <Award className="text-primary-600" size={24} />,
      description: "GATE Computer Science Engineering test series with previous year patterns",
      color: "primary",
      totalTests: 20,
      duration: "180 minutes per test",
      price: "₹1499",
      lastUpdated: "July 2023",
      features: [
        "Based on latest GATE CSE pattern",
        "Detailed solutions & explanations",
        "Performance analysis",
        "Previous year question patterns",
        "Sectional tests for all subjects"
      ],
      categories: {
        "Set Wise": [
          { id: 1, name: "Full Length Mock Test 1", questions: 65, duration: "180 min" },
          { id: 2, name: "Full Length Mock Test 2", questions: 65, duration: "180 min" },
          { id: 3, name: "Previous Year Pattern 2023", questions: 65, duration: "180 min" }
        ],
        "Subject Wise": [
          { id: 4, name: "Data Structures", questions: 10, duration: "30 min" },
          { id: 5, name: "Algorithms", questions: 10, duration: "30 min" },
          { id: 6, name: "Operating Systems", questions: 10, duration: "30 min" }
        ],
        "Topic Wise": [
          { id: 7, name: "Graph Theory", questions: 10, duration: "30 min" },
          { id: 8, name: "DBMS", questions: 10, duration: "30 min" },
          { id: 9, name: "Computer Networks", questions: 10, duration: "30 min" }
        ]
      }
    }
  };

  // Get the exam data based on the ID from URL parameters
  const exam = examDetails[examId] || examDetails[1]; // Fallback to SSC CGL if invalid ID
  
  const [activeCategory, setActiveCategory] = React.useState("Set Wise");

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
            <div className={`bg-${exam.color}-50 w-14 h-14 rounded-xl flex items-center justify-center mr-4`}>
              {exam.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{exam.name} Test Series</h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center">
            <span>Buy Now for {exam.price}</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>

        {/* Exam Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
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
              <div className={`bg-${exam.color}-50 p-2 rounded-lg mr-3`}>
                <Hash className={`text-${exam.color}-600`} size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Tests</div>
                <div className="text-xl font-semibold text-gray-800">{exam.totalTests}</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className={`bg-${exam.color}-50 p-2 rounded-lg mr-3`}>
                <Clock className={`text-${exam.color}-600`} size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Test Duration</div>
                <div className="text-xl font-semibold text-gray-800">{exam.duration}</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className={`bg-${exam.color}-50 p-2 rounded-lg mr-3`}>
                <Trophy className={`text-${exam.color}-600`} size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-xl font-semibold text-gray-800">{exam.lastUpdated}</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <div className={`bg-${exam.color}-50 p-2 rounded-lg mr-3`}>
                <BarChart2 className={`text-${exam.color}-600`} size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Performance</div>
                <div className="text-xl font-semibold text-gray-800">Advanced</div>
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
                {exam.features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`bg-${exam.color}-50 p-1 rounded-full mr-3 mt-0.5`}>
                      <div className={`bg-${exam.color}-600 w-2 h-2 rounded-full`}></div>
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
              {Object.keys(exam.categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${activeCategory === category ? `bg-${exam.color}-600 text-white` : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Tests List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {exam.categories[activeCategory].map((test, index) => (
                <motion.div
                  key={test.id}
                  className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-lg font-medium text-gray-800">{test.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="flex items-center mr-4">
                          <Hash className="h-4 w-4 mr-1" />
                          {test.questions} Questions
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {test.duration}
                        </span>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium ${index % 3 === 0 ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50'}`}>
                      {index % 3 === 0 ? 'Start Test' : 'View Details'}
                    </button>
                  </div>
                </motion.div>
              ))}
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