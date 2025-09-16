import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Check, X, Flag, ChevronLeft, ChevronRight, Bookmark, RotateCw, AlertCircle, Maximize, Minimize, Lock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testAPI } from '../services/api';

const MockTestInterface = () => {
  const { examId, testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attemptId, setAttemptId] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setWarningCount(prev => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        
        if (warningCount >= 2) {
          handleForceSubmit();
        }
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        setWarningCount(prev => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        
        if (warningCount >= 2) {
          handleForceSubmit();
        }
      }
    };

    const handleBlur = () => {
      if (!isSubmitted) {
        setWarningCount(prev => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        
        if (warningCount >= 2) {
          handleForceSubmit();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isSubmitted, warningCount]);

  const handleForceSubmit = useCallback(async () => {
    setIsSubmitted(true);
    
    try {
      const responses = questions.map(q => ({
        questionId: q._id,
        selectedOption: q.answered,
        timeSpent: 0
      }));

      await testAPI.submitTest(attemptId, { responses });
      
      if (isFullScreen) {
        exitFullScreen();
      }
      
      navigate(`/test-results/${examId}/${testId}`, { 
        state: { 
          attemptId,
          terminated: true 
        } 
      });
    } catch (error) {
      console.error('Error force submitting test:', error);
    }
  }, [attemptId, examId, testId, isFullScreen, navigate, questions]);

  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTest(testId);
      console.log('Fetched test data:', response.data);
      setTest(response.data);
      setTimeLeft(response.data.duration * 60); // Convert minutes to seconds
      
      const initialQuestions = response.data.questions.map((q, index) => ({
        ...q,
        marked: false,
        visited: index === 0,
        answered: null,
        timeSpent: 0
      }));
      
      setQuestions(initialQuestions);
    } catch (error) {
      setError('Failed to load test');
      console.error('Error fetching test:', error);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!attemptId) return; // test not started yet
    if (timeLeft <= 0 || isSubmitted) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleForceSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      
      // Update time spent on current question
      if (questions.length > 0) {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].timeSpent += 1;
        setQuestions(updatedQuestions);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleForceSubmit, attemptId, currentQuestionIndex, questions]);

  // Mark question as visited when displayed
  useEffect(() => {
    if (questions.length > 0 && !questions[currentQuestionIndex].visited) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].visited = true;
      setQuestions(updatedQuestions);
    }
  }, [currentQuestionIndex, questions]);

  // Start test
  const startTest = async () => {
    try {
      const response = await testAPI.startTest(testId);
      setAttemptId(response.data.attemptId);
      setTimeLeft(test.duration * 60); // move timer setup here
      setShowInstructions(false);
      enterFullScreen();
    } catch (error) {
      setError('Failed to start test');
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = async (optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answered = optionIndex;
    setQuestions(updatedQuestions);

    try {
      await testAPI.saveTestProgress(attemptId, {
        responses: updatedQuestions.map(q => ({
          questionId: q._id,
          selectedOption: q.answered,
          timeSpent: q.timeSpent || 0
        })),
        currentQuestionIndex,
        timeSpent: test.duration * 60 - timeLeft
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
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
  };

  const handleConfirmSubmit = async () => {
    try {
      const responses = questions.map(q => ({
        questionId: q._id,
        selectedOption: q.answered,
        timeSpent: q.timeSpent || 0
      }));

      await testAPI.submitTest(attemptId, { responses });
      
      if (isFullScreen) {
        exitFullScreen();
      }
      
      navigate(`/test-results/${examId}/${testId}`, { 
        state: { 
          attemptId,
          totalTimeSpent: test.duration * 60 - timeLeft
        } 
      });
    } catch (error) {
      setError('Failed to submit test');
      console.error('Error submitting test:', error);
    }
  };

  // Full screen functions
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setIsFullScreen(true));
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-teal-600 text-white font-bold text-xl p-2 rounded">
              QualityEdge
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Test Instructions</h2>
          
          <div className="space-y-4 mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <div className="bg-teal-600 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">Total duration: <strong>{test.duration} minutes</strong></span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-600 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">Number of questions: <strong>{questions.length}</strong></span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-600 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">Each question has <strong>4 options</strong> with only <strong>1 correct answer</strong></span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-600 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700"><strong>No negative marking</strong> for wrong answers</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-600 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-gray-700">You can <strong>mark questions for review</strong> using the flag icon</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-red-600 font-semibold">The test will open in full-screen mode. Switching tabs or applications may result in test termination.</span>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <span className="text-red-600 font-semibold">Right-click, developer tools, and keyboard shortcuts are disabled.</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={startTest}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Lock className="h-5 w-5 mr-2" />
              Start Test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Submit Test</h2>
          <p className="text-gray-600 mb-6 text-center">Are you sure you want to submit the test? You cannot change your answers after submission.</p>
          
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between mb-3">
              <span className="text-gray-700">Answered</span>
              <span className="font-medium text-green-600">
                {questions.filter(q => q.answered !== null).length}/{questions.length}
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700">Marked for Review</span>
              <span className="font-medium text-yellow-600">
                {questions.filter(q => q.marked).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Not Answered</span>
              <span className="font-medium text-red-600">
                {questions.filter(q => q.answered === null).length}
              </span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Confirm Submit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = questions.filter(q => q.answered !== null).length;
  const markedCount = questions.filter(q => q.marked).length;

  return (
    <div className="mock-test-container bg-gray-50 text-gray-800 fixed inset-0 overflow-hidden flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="bg-teal-600 text-white font-bold text-lg p-1 rounded mr-4">
            QualityEdge
          </div>
          <h1 className="text-xl font-semibold text-gray-800">{test.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 border border-gray-300'}`}>
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="hidden md:flex space-x-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm border border-green-200">
              Answered: {answeredCount}
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm border border-yellow-200">
              Marked: {markedCount}
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm border border-red-200">
              Unanswered: {questions.length - answeredCount}
            </div>
          </div>
          
          <button 
            onClick={handleSubmitTest}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            {/* Question Navigation */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button 
                onClick={handleMarkQuestion}
                className={`p-2 rounded-lg flex items-center ${currentQuestion.marked ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'}`}
              >
                <Flag className="h-5 w-5 mr-1" />
                {currentQuestion.marked ? 'Unmark' : 'Mark for Review'}
              </button>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 text-gray-800">
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
                      className={`w-full text-left p-4 rounded-lg transition-all ${currentQuestion.answered === index ? 'bg-teal-100 border-teal-500 text-teal-900 border-2' : 'bg-white border border-gray-300 hover:bg-gray-50'} `}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
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
                className={`flex items-center px-4 py-2 rounded-lg ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'}`}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg ${currentQuestionIndex === questions.length - 1 ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'}`}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Questions Overview Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-5 overflow-y-auto hidden lg:block shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">Question Palette</h3>
            <button 
              onClick={() => setShowLegend(!showLegend)}
              className="text-teal-600 hover:text-teal-800"
              title="Show Legend"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
          
          {showLegend && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Color Legend:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-400 mr-2 rounded-sm"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 mr-2 rounded-sm"></div>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-400 mr-2 rounded-sm"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-400 mr-2 rounded-sm"></div>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-teal-100 border-2 border-teal-600 mr-2 rounded-sm"></div>
                  <span>Current Question</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-5 gap-3 mb-6">
            {questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => handleQuestionNavigation(index)}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentQuestionIndex === index ? 'ring-2 ring-teal-600 bg-teal-50 text-teal-800 border border-teal-300' : q.answered !== null ? 'bg-green-100 text-green-800 border border-green-300' : q.marked ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : q.visited ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-700">Answered:</span>
              <span className="text-sm font-medium text-green-700">{answeredCount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-700">Marked:</span>
              <span className="text-sm font-medium text-yellow-700">{markedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Not Answered:</span>
              <span className="text-sm font-medium text-red-700">{questions.length - answeredCount}</span>
            </div>
          </div>

          <button 
            onClick={handleSubmitTest}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors mt-4"
          >
            Submit Test
          </button>
        </div>
      </main>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-red-100 text-red-900 p-6 rounded-xl max-w-md text-center border border-red-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-2">Warning #{warningCount}</h3>
              <p className="mb-4">You are not allowed to switch tabs or use developer tools. Your test will be submitted automatically after 3 warnings.</p>
              <p className="font-medium">Warnings: {warningCount}/3</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Question Navigator (fixed at bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
        <div className="flex overflow-x-auto space-x-2 pb-1">
          {questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => handleQuestionNavigation(index)}
              className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded text-xs ${currentQuestionIndex === index ? 'ring-2 ring-teal-600 bg-teal-50 text-teal-800 border border-teal-300' : q.answered !== null ? 'bg-green-100 text-green-800 border border-green-300' : q.marked ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : q.visited ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockTestInterface;