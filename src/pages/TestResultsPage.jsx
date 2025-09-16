// src/pages/TestResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Clock, 
  BookOpen, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield,  
  RotateCw, 
  Lightbulb , 
  BarChart3 ,
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calendar 

 } from 'lucide-react';
import { motion } from 'framer-motion';
import { testAPI } from '../services/api';
import axios from 'axios';

const TestResultsPage = () => {
  const { examId, testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { attemptId } = location.state || {};
  const [aiInsights, setAiAnalysis] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (attemptId) {
      fetchTestResults();
    }
  }, [attemptId]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestResults(attemptId);
      const aianalysis = await testAPI.getAiAnalysis(testId, response.data.testAttempt, response.data.detailedResults);
      setAiAnalysis(aianalysis.data);
      console.log('Test results response:', response.data);
      console.log('AI analysis response:', aianalysis.data);
      setResults(response.data);
    } catch (error) {
      setError('Failed to load test results');
      console.error('Error fetching test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeTest = () => {
    navigate(`/exam-details/${examId}`);
  };

  const handleNewTest = () =>{
    navigate(`/exam-test-series`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Results not found</h2>
          <p className="text-gray-600">{error || 'Unable to load test results.'}</p>
        </div>
      </div>
    );
  }

  const { testAttempt, detailedResults, timeDistribution, aiInsightss } = results;

  // Calculate percentages and other metrics
  const percentage = Math.round(testAttempt.score);
  const total = testAttempt.totalQuestions;
  const score = testAttempt.correctAnswers;
  const incorrect = total - score;
  const accuracy = Math.round(testAttempt.accuracy);
  const timeSpent = testAttempt.timeSpent;

  // Convert icon strings to actual components
  const iconMap = {
    '📈': <TrendingUp className="text-green-500" />,
    '📉': <TrendingDown className="text-red-500" />,
    '⚡': <Zap className="text-yellow-500" />,
    '🛡️': <Shield className="text-blue-500" />
  };

  // Performance rating based on score
  const getPerformanceRating = () => {
    if (percentage >= 90) return { text: "Exceptional", color: "text-purple-600", bg: "bg-purple-100" };
    if (percentage >= 75) return { text: "Great", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 60) return { text: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    return { text: "Needs Improvement", color: "text-orange-600", bg: "bg-orange-100" };
  };

  const performance = getPerformanceRating();

  const COLORS = ['#4F46E5', '#22C55E', '#F97316', '#E11D48', '#0EA5E9', '#A855F7'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Results</h1>
          <p className="text-lg text-gray-600">Detailed analysis of your performance</p>
        </motion.div>

        {/* Score Summary */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {/* Overall Score */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center relative overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full"></div>
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary-600"
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 2.51} 251`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold">{percentage}%</span>
                <span className="text-sm text-gray-500">Score</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full ${performance.bg} ${performance.color} text-sm font-medium mb-2`}>
              {performance.text}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Overall Performance</h3>
            <p className="text-gray-600 text-center">
              You scored {score} out of {total} questions correctly
            </p>
          </motion.div>

          {/* Accuracy */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center relative overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50 rounded-tr-full"></div>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Accuracy</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">{accuracy}%</p>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-green-600 font-bold">{score}</div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold">{incorrect}</div>
                <div className="text-xs text-gray-500">Incorrect</div>
              </div>
            </div>
          </motion.div>

          {/* Time Spent */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center relative overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-50 rounded-br-full"></div>
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Time Spent</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            </p>
            <p className="text-gray-600 text-center">
              {Math.round((timeSpent / total) * 100) / 100} sec per question
            </p>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex">
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'insights' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('insights')}
          >
            <Lightbulb className="inline-block h-5 w-5 mr-2" />
            AI Insights
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'review' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('review')}
          >
            <BookOpen className="inline-block h-5 w-5 mr-2" />
            Review
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'insights' && (
  <motion.div
    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
      AI-Powered Performance Insights
    </h2>
    
    {/* Overall Feedback Section */}
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <BarChart3 className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Overall Performance Summary</h3>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-gray-700">{aiInsights.overallFeedback}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths Section */}
      <motion.div
        className="border border-green-200 rounded-xl p-5 bg-green-50"
        whileHover={{ y: -3 }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-lg mr-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Your Strengths</h3>
        </div>
        <ul className="space-y-3">
          {aiInsights.strengths.map((strength, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      
      {/* Weaknesses Section */}
      <motion.div
        className="border border-red-200 rounded-xl p-5 bg-red-50"
        whileHover={{ y: -3 }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-lg mr-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Areas for Improvement</h3>
        </div>
        <ul className="space-y-3">
          {aiInsights.weaknesses.map((weakness, index) => (
            <li key={index} className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{weakness}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
    
    {/* Suggestions Section */}
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <Lightbulb className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Personalized Study Recommendations</h3>
      </div>
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
        <ul className="space-y-3">
          {aiInsights.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <div className="bg-white p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    
    {/* Action Plan */}
    <div className="mt-8 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-teal-600" />
        Recommended Action Plan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-teal-100">
          <div className="text-teal-600 font-semibold mb-2">Short-term (1-2 weeks)</div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Focus on memorizing key facts</li>
            <li>• Practice 10 reasoning questions daily</li>
            <li>• Learn 5 new vocabulary words each day</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg border border-teal-100">
          <div className="text-teal-600 font-semibold mb-2">Medium-term (3-4 weeks)</div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Take 2-3 practice tests weekly</li>
            <li>• Review incorrect answers thoroughly</li>
            <li>• Focus on time management skills</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg border border-teal-100">
          <div className="text-teal-600 font-semibold mb-2">Long-term (1+ months)</div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Develop consistent study routine</li>
            <li>• Track progress with performance metrics</li>
            <li>• Focus on weakest areas identified</li>
          </ul>
        </div>
      </div>
    </div>
  </motion.div>
)}

        {activeTab === 'review' && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Questions to Review
            </h2>
            <div className="space-y-4">
              {detailedResults
                .filter(q => !q.isCorrect)
                .map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">
                        {question.question}
                      </h3>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Incorrect
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Your Answer</p>
                        <p className="font-medium text-red-600">
                          {question.selectedOption !== null 
                            ? question.options[question.selectedOption] 
                            : 'Not attempted'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Correct Answer</p>
                        <p className="font-medium text-green-600">
                          {question.options[question.correctAnswer]}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-700">{question.explanation}</p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={handleRetakeTest}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <RotateCw className="h-5 w-5 mr-2" />
            Go to the Course
          </button>
          <button
            onClick={handleNewTest}
            className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Try Another Test
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TestResultsPage;