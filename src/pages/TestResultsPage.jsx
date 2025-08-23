import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Award, Clock, Check, X, BookOpen, AlertCircle, TrendingUp, TrendingDown, Zap, Shield, Bookmark, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

const TestResultsPage = () => {
  const { examId, testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, responses } = location.state || {
    score: 15,
    total: 25,
    responses: Array(25).fill().map((_, i) => ({
      id: i + 1,
      answered: Math.floor(Math.random() * 4),
      correctAnswer: Math.floor(Math.random() * 4),
      marked: Math.random() > 0.7,
      subject: ['Quant', 'English', 'Reasoning', 'GK'][Math.floor(Math.random() * 4)],
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]
    }))
  };

  // Calculate percentages and other metrics
  const percentage = Math.round((score / total) * 100);
  const incorrect = total - score;
  const accuracy = Math.round((score / (score + incorrect)) * 100) || 0;
  const timeSpent = Math.floor(Math.random() * 60) + 60; // Random time between 60-120 mins

  // Subject-wise performance data
  const subjects = ['Quant', 'English', 'Reasoning', 'GK'];
  const subjectData = subjects.map(subject => {
    const subjectQuestions = responses.filter(q => q.subject === subject);
    const correct = subjectQuestions.filter(q => q.answered === q.correctAnswer).length;
    return {
      subject,
      correct,
      total: subjectQuestions.length,
      percentage: Math.round((correct / subjectQuestions.length) * 100) || 0
    };
  });

  // Difficulty-wise performance data
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const difficultyData = difficulties.map(diff => {
    const diffQuestions = responses.filter(q => q.difficulty === diff);
    const correct = diffQuestions.filter(q => q.answered === q.correctAnswer).length;
    return {
      difficulty: diff,
      correct,
      total: diffQuestions.length,
      percentage: Math.round((correct / diffQuestions.length) * 100) || 0
    };
  });

  // Chart data
  const subjectChartData = subjectData.map(item => ({
    name: item.subject,
    Correct: item.correct,
    Incorrect: item.total - item.correct
  }));

  const difficultyChartData = difficultyData.map(item => ({
    name: item.difficulty,
    Correct: item.correct,
    Incorrect: item.total - item.correct
  }));

  const timeDistributionData = [
    { name: 'Quant', value: 35 },
    { name: 'English', value: 25 },
    { name: 'Reasoning', value: 20 },
    { name: 'GK', value: 20 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // AI Analysis Insights
  const aiInsights = [
    {
      icon: <TrendingUp className="text-green-500" />,
      title: "Strong Area",
      content: "Your performance in Quantitative Aptitude is excellent (85% accuracy). Keep practicing to maintain this strength."
    },
    {
      icon: <TrendingDown className="text-red-500" />,
      title: "Weak Area",
      content: "General Knowledge needs improvement (45% accuracy). Focus on current affairs and static GK."
    },
    {
      icon: <Zap className="text-yellow-500" />,
      title: "Time Management",
      content: "You spent 40% of your time on Reasoning. Consider balancing time across all sections."
    },
    {
      icon: <Shield className="text-blue-500" />,
      title: "Test Strategy",
      content: "You attempted 92% of questions. Good attempt rate but accuracy could improve with more careful reading."
    }
  ];

  // Question Review Data
  const questionReviewData = responses
    .filter(q => q.answered !== q.correctAnswer)
    .slice(0, 3)
    .map(q => ({
      id: q.id,
      question: `Question about ${q.subject} (${q.difficulty})`,
      yourAnswer: ['A', 'B', 'C', 'D'][q.answered],
      correctAnswer: ['A', 'B', 'C', 'D'][q.correctAnswer],
      explanation: "This question tested your understanding of basic concepts. The correct approach was to..."
    }));

  const handleRetakeTest = () => {
    navigate(`/exam-details/${examId}`);
  };

  const handleNewTest = () => {
    navigate(`/exam-test-series`);
  };

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
              {Math.floor(timeSpent / 60)}h {timeSpent % 60}m
            </p>
            <p className="text-gray-600 text-center">
              {Math.round((timeSpent / total) * 100) / 100} min per question
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
              {subjectData.map((subject, index) => (
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
                    data={timeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {timeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {timeDistributionData.map((item, index) => (
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
            {difficultyData.map((diff, index) => (
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
                    {insight.icon}
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
        {/* <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions to Review</h2>
          <div className="space-y-4">
            {questionReviewData.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{question.question}</h3>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Incorrect
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Your Answer</p>
                    <p className="font-medium text-red-600">{question.yourAnswer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correct Answer</p>
                    <p className="font-medium text-green-600">{question.correctAnswer}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                  <p className="text-sm text-blue-700">{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

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