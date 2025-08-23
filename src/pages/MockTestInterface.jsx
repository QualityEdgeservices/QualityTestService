import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Check, X, Flag, ChevronLeft, ChevronRight, Bookmark, RotateCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MockTestInterface = () => {
  const { examId, testId } = useParams();
  const navigate = useNavigate();
  
  // Sample test data
  const testData = {
    1: { // SSC CGL
      1: {
        title: "SSC CGL Full Length Mock Test 1",
        duration: 7200, // 120 minutes in seconds
        questions: [
          {
            id: 1,
            question: "If the ratio of the areas of two squares is 16:25, then the ratio of their perimeters is:",
            options: ["4:5", "5:4", "16:25", "25:16"],
            correctAnswer: 0,
            marked: false,
            visited: false,
            answered: null
          },
          {
            id: 2,
            question: "The average of first 50 natural numbers is:",
            options: ["25.30", "25.5", "25.00", "12.25"],
            correctAnswer: 1,
            marked: false,
            visited: false,
            answered: null
          },
          {
            id: 3,
            question: "Which of the following is not a prime number?",
            options: ["31", "61", "71", "91"],
            correctAnswer: 3,
            marked: false,
            visited: false,
            answered: null
          },
          {
            id: 4,
            question: "The capital of Uttarakhand is:",
            options: ["Dehradun", "Nainital", "Mussoorie", "Haridwar"],
            correctAnswer: 0,
            marked: false,
            visited: false,
            answered: null
          },
          {
            id: 5,
            question: "Who wrote 'India Wins Freedom'?",
            options: [
              "Mahatma Gandhi",
              "Jawaharlal Nehru",
              "Abul Kalam Azad",
              "Sarojini Naidu"
            ],
            correctAnswer: 2,
            marked: false,
            visited: false,
            answered: null
          }
        ]
      }
    },
    2: { // SSC CHSL
      1: {
        title: "SSC CHSL Full Length Mock Test 1",
        duration: 5400, // 90 minutes in seconds
        questions: [
          // Similar question structure for CHSL
        ]
      }
    }
  };

  const test = testData[examId]?.[testId] || testData[1][1]; // Fallback to SSC CGL Test 1
  const [questions, setQuestions] = useState(test.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.duration);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Mark question as visited when displayed
  useEffect(() => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[currentQuestionIndex].visited) {
      updatedQuestions[currentQuestionIndex].visited = true;
      setQuestions(updatedQuestions);
    }
  }, [currentQuestionIndex, questions]);

  // Format time display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answered = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleMarkQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].marked = !updatedQuestions[currentQuestionIndex].marked;
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    // In a real app, you would send the results to a server here
  };

  const handleConfirmSubmit = () => {
    // Calculate score and navigate to results page
    const score = questions.filter(
      (q, i) => q.answered === q.correctAnswer
    ).length;
    navigate(`/test-results/${examId}/${testId}`, { 
      state: { 
        score, 
        total: questions.length,
        responses: questions 
      } 
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Instructions</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-primary-100 p-1 rounded-full mr-3 mt-0.5">
                <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">Total duration of the test is <strong>{Math.floor(test.duration / 60)} minutes</strong>.</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-1 rounded-full mr-3 mt-0.5">
                <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">The test contains <strong>{questions.length} questions</strong>.</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-1 rounded-full mr-3 mt-0.5">
                <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">Each question has <strong>4 options</strong> with only <strong>1 correct answer</strong>.</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-1 rounded-full mr-3 mt-0.5">
                <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">There is <strong>no negative marking</strong> for wrong answers.</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-1 rounded-full mr-3 mt-0.5">
                <div className="bg-primary-600 w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">You can <strong>mark questions for review</strong> using the flag icon.</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setShowInstructions(false)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Start Test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-xl max-w-md w-full p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Test</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to submit the test? You won't be able to change your answers after submission.</p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Answered</span>
              <span className="font-medium">
                {questions.filter(q => q.answered !== null).length}/{questions.length}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Marked for Review</span>
              <span className="font-medium">
                {questions.filter(q => q.marked).length}/{questions.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Not Answered</span>
              <span className="font-medium">
                {questions.filter(q => q.answered === null).length}/{questions.length}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmSubmit}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{test.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-red-50 px-3 py-1 rounded-lg text-red-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
            <button 
              onClick={handleSubmitTest}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Question Panel */}
          <div className="lg:w-3/4 bg-white rounded-xl shadow-sm p-6">
            {/* Question Navigation */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleMarkQuestion}
                  className={`p-2 rounded-lg ${currentQuestion.marked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Flag className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {currentQuestion.question}
              </h2>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <button
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${currentQuestion.answered === index ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300'}`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg ${currentQuestionIndex === questions.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>

          {/* Questions Overview Panel */}
          <div className="lg:w-1/4 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <h3 className="font-medium text-gray-800 mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentQuestionIndex === index ? 'bg-primary-600 text-white' : q.answered !== null ? 'bg-green-100 text-green-700' : q.marked ? 'bg-yellow-100 text-yellow-700' : q.visited ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Marked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Visited</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Not Visited</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={handleSubmitTest}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockTestInterface;