// src/pages/TestResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Award, Clock, Check, X, BookOpen, AlertCircle, TrendingUp, TrendingDown, Zap, Shield, Bookmark, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { testAPI } from '../services/api';

const TestResultsPage = () => {
  const { examId, testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { attemptId } = location.state || {};
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attemptId) {
      fetchTestResults();
    }
  }, [attemptId]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestResults(attemptId);
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

  const handleNewTest = () => {
    navigate(`/exam-test-series`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Results not found</h2>
          <p className="text-gray-600">{error || 'Unable to load test results.'}</p>
        </div>
      </div>
    );
  }

  const { testAttempt, detailedResults, subjectPerformance, difficultyPerformance, timeDistribution, aiInsights } = results;

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

  // Chart data
  const subjectChartData = subjectPerformance.map(item => ({
    name: item.subject,
    Correct: item.correct,
    Incorrect: item.total - item.correct
  }));

  const difficultyChartData = difficultyPerformance.map(item => ({
    name: item.difficulty,
    Correct: item.correct,
    Incorrect: item.total - item.correct
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Results</h1>
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
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center"
            whileHover={{ y: -5 }}
          >
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Overall Performance</h3>
            <p className="text-gray-600 text-center">
              You scored {score} out of {total} questions correctly
            </p>
          </motion.div>

          {/* Accuracy */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center"
            whileHover={{ y: -5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Accuracy</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">{accuracy}%</p>
            <p className="text-gray-600 text-center">
              {score} correct, {incorrect} incorrect
            </p>
          </motion.div>

          {/* Time Spent */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center"
            whileHover={{ y: -5 }}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-blue-600" />
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

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Subject-wise Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Correct" fill="#4CAF50" name="Correct" />
                  <Bar dataKey="Incorrect" fill="#F44336" name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {subjectPerformance.map((subject, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-800">{subject.subject}</h3>
                  <p className="text-2xl font-bold">{subject.percentage}%</p>
                  <p className="text-sm text-gray-500">
                    {subject.correct}/{subject.total} correct
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Time Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Distribution</h2>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {timeDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-gray-700">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty-wise Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Difficulty-wise Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Correct" fill="#4CAF50" name="Correct" />
                <Bar dataKey="Incorrect" fill="#F44336" name="Incorrect" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {difficultyPerformance.map((diff, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800">{diff.difficulty} Questions</h3>
                <p className="text-2xl font-bold">{diff.percentage}%</p>
                <p className="text-sm text-gray-500">
                  {diff.correct}/{diff.total} correct
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start">
                  <div className="p-2 rounded-lg mr-3">
                    {iconMap[insight.icon] || <AlertCircle className="text-gray-500" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                    <p className="text-gray-600">{insight.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions to Review</h2>
          <div className="space-y-4">
            {detailedResults
              .filter(q => !q.isCorrect)
              .slice(0, 3)
              .map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">
                      {question.question} ({question.subject} - {question.difficulty})
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleRetakeTest}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <RotateCw className="h-5 w-5 mr-2" />
            Go to the Course
          </button>
          <button
            onClick={handleNewTest}
            className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Try Another Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsPage;