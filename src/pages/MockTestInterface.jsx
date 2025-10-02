import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Check, X, Flag, ChevronLeft, ChevronRight, Bookmark, RotateCw, AlertCircle, Maximize, Minimize, Lock, Info, Camera, Mic, MicOff, Video, VideoOff, User, Eye, EyeOff } from 'lucide-react';
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
  const [fullScreenForced, setFullScreenForced] = useState(false);
  
  // Proctoring states
  const [cameraActive, setCameraActive] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [proctoringReady, setProctoringReady] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const faceDetectionInterval = useRef(null);
  const audioMonitoringInterval = useRef(null);
  const activityMonitorInterval = useRef(null);
  const screenshotInterval = useRef(null);
  const fullScreenCheckInterval = useRef(null);

  // Fetch test data
  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTest(testId);
      console.log('Fetched test data:', response.data);
      setTest(response.data);
      setTimeLeft(response.data.duration * 60);
      
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

  // STRICT Full-screen enforcement
  useEffect(() => {
    if (!attemptId || isSubmitted) return;

    const enforceFullScreen = () => {
      if (!document.fullscreenElement && !isSubmitted) {
        console.log('Full-screen violated - forcing fullscreen');
        enterFullScreen();
        logSuspiciousActivity('Attempted to exit full-screen', 'high');
        addWarning();
      }
    };

    // Check fullscreen status every second
    fullScreenCheckInterval.current = setInterval(enforceFullScreen, 1000);

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', enforceFullScreen);
    document.addEventListener('webkitfullscreenchange', enforceFullScreen);
    document.addEventListener('mozfullscreenchange', enforceFullScreen);
    document.addEventListener('MSFullscreenChange', enforceFullScreen);

    return () => {
      clearInterval(fullScreenCheckInterval.current);
      document.removeEventListener('fullscreenchange', enforceFullScreen);
      document.removeEventListener('webkitfullscreenchange', enforceFullScreen);
      document.removeEventListener('mozfullscreenchange', enforceFullScreen);
      document.removeEventListener('MSFullscreenChange', enforceFullScreen);
    };
  }, [attemptId, isSubmitted]);

  // Enhanced anti-cheating measures with strict escape prevention
  useEffect(() => {
    if (!attemptId || isSubmitted) return;

    // Track mouse movements and inactivity
    let mouseMoveCount = 0;
    let lastMouseMove = Date.now();
    
    const handleMouseMove = () => {
      mouseMoveCount++;
      lastMouseMove = Date.now();
    };

    const handleKeyPress = (e) => {
      logSuspiciousActivity(`Key pressed: ${e.key}`, 'low');
    };

    // STRICTER Keydown handler - Block ALL escape attempts
    const handleKeyDown = (e) => {
      const blockedKeys = [
        'Escape', // Block Escape completely
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
        'PrintScreen',
        'ScrollLock',
        'Pause',
        'ContextMenu',
        ...(e.ctrlKey || e.metaKey) ? [
          'r', 'R', // Refresh
          'n', 'N', // New window
          't', 'T', // New tab
          'w', 'W', // Close tab
          'u', 'U', // View source
          'i', 'I', // Developer tools
          'c', 'C', // Copy
          'v', 'V', // Paste
          'x', 'X', // Cut
          'a', 'A', // Select all
          'p', 'P', // Print
          's', 'S', // Save
          'o', 'O', // Open
          'h', 'H', // History
          'f', 'F', // Find
          'g', 'G', // Find next
          'd', 'D', // Bookmark
          'l', 'L', // Address bar
          'b', 'B', // Bookmarks
          'j', 'J', // Downloads
          'k', 'K', // Focus search
          'm', 'M', // Mute
          'q', 'Q', // Quit
          'z', 'Z'  // Undo
        ] : [],
        ...(e.altKey) ? [
          'Tab',
          'F4',
          'Space',
          'Enter'
        ] : [],
        ...(e.shiftKey) ? [
          'F10',
          'Tab'
        ] : []
      ];

      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        logSuspiciousActivity(`Blocked key: ${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`, 'high');
        
        // Immediate termination for escape key
        if (e.key === 'Escape') {
          logSuspiciousActivity('ESCAPE KEY PRESSED - IMMEDIATE TERMINATION', 'critical');
          handleImmediateTermination();
          return;
        }
        
        addWarning();
      }
    };

    // Monitor inactivity
    const inactivityInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastMouseMove;
      if (inactiveTime > 30000) {
        logSuspiciousActivity('Prolonged inactivity detected', 'medium');
      }
      
      if (mouseMoveCount > 1000) {
        logSuspiciousActivity('Rapid mouse movements detected', 'medium');
      }
      mouseMoveCount = 0;
    }, 10000);

    // Enhanced event listeners
    const handleContextMenu = (e) => {
      e.preventDefault();
      logSuspiciousActivity('Right-click attempt blocked', 'high');
      addWarning();
      return false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSuspiciousActivity('Tab/window switch detected', 'high');
        addWarning();
      }
    };

    const handleResize = () => {
      if (!document.fullscreenElement) {
        logSuspiciousActivity('Fullscreen exit detected', 'high');
        enterFullScreen();
        addWarning();
      }
    };

    const handleBlur = () => {
      logSuspiciousActivity('Window lost focus', 'high');
      addWarning();
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleCopy = (e) => {
      e.preventDefault();
      logSuspiciousActivity('Copy attempt blocked', 'high');
      addWarning();
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      logSuspiciousActivity('Paste attempt blocked', 'high');
      addWarning();
      return false;
    };

    const handlePopState = (e) => {
      window.history.pushState(null, document.title, window.location.href);
      logSuspiciousActivity('Navigation attempt blocked', 'high');
      addWarning();
    };

    // Add ALL event listeners with capture phase
    const options = { capture: true, passive: false };
    
    document.addEventListener('mousemove', handleMouseMove, options);
    document.addEventListener('keypress', handleKeyPress, options);
    document.addEventListener('keydown', handleKeyDown, options);
    document.addEventListener('contextmenu', handleContextMenu, options);
    document.addEventListener('visibilitychange', handleVisibilityChange, options);
    document.addEventListener('selectstart', handleSelectStart, options);
    document.addEventListener('dragstart', handleDragStart, options);
    document.addEventListener('copy', handleCopy, options);
    document.addEventListener('paste', handlePaste, options);
    window.addEventListener('resize', handleResize, options);
    window.addEventListener('blur', handleBlur, options);
    window.addEventListener('popstate', handlePopState, options);

    // Block wheel attempts to zoom
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        logSuspiciousActivity('Zoom attempt blocked', 'medium');
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: false });

    // Push state to prevent back button
    window.history.pushState(null, document.title, window.location.href);

    // Start activity monitoring
    activityMonitorInterval.current = setInterval(() => {
      monitorUserActivity();
    }, 5000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, options);
      document.removeEventListener('keypress', handleKeyPress, options);
      document.removeEventListener('keydown', handleKeyDown, options);
      document.removeEventListener('contextmenu', handleContextMenu, options);
      document.removeEventListener('visibilitychange', handleVisibilityChange, options);
      document.removeEventListener('selectstart', handleSelectStart, options);
      document.removeEventListener('dragstart', handleDragStart, options);
      document.removeEventListener('copy', handleCopy, options);
      document.removeEventListener('paste', handlePaste, options);
      document.removeEventListener('wheel', handleWheel, options);
      window.removeEventListener('resize', handleResize, options);
      window.removeEventListener('blur', handleBlur, options);
      window.removeEventListener('popstate', handlePopState, options);
      clearInterval(inactivityInterval);
      clearInterval(activityMonitorInterval.current);
    };
  }, [attemptId, isSubmitted]);

  // Timer effect
  useEffect(() => {
    if (!attemptId) return;
    if (timeLeft <= 0 || isSubmitted) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleForceSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      
      if (questions.length > 0) {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].timeSpent += 1;
        setQuestions(updatedQuestions);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, attemptId, currentQuestionIndex, questions]);

  // Mark question as visited when displayed
  useEffect(() => {
    if (questions.length > 0 && !questions[currentQuestionIndex].visited) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].visited = true;
      setQuestions(updatedQuestions);
    }
  }, [currentQuestionIndex, questions]);

  // Proctoring setup
  const initializeProctoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }

      setupAudioMonitoring(stream);
      startFaceDetection();
      startPeriodicScreenshots();
      checkTestingEnvironment();

      setProctoringReady(true);

    } catch (error) {
      console.error('Proctoring setup failed:', error);
      logSuspiciousActivity('Proctoring setup failed - camera/mic access denied', 'high');
      addWarning();
      setProctoringReady(true);
    }
  };

  const setupAudioMonitoring = (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      setMicrophoneActive(true);

      audioMonitoringInterval.current = setInterval(() => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setNoiseLevel(average);
          
          if (average > 80) {
            logSuspiciousActivity('High audio noise detected', 'medium');
          }
          
          if (average < 10 && microphoneActive) {
            logSuspiciousActivity('Microphone possibly disconnected', 'high');
          }
        }
      }, 1000);
    } catch (error) {
      console.error('Audio monitoring setup failed:', error);
    }
  };

  const startFaceDetection = () => {
    faceDetectionInterval.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const faceDetected = await detectFacePresence(imageData);
        
        setFaceDetected(faceDetected);
        
        if (!faceDetected) {
          logSuspiciousActivity('Face not detected in frame', 'high');
          addWarning();
        }
      }
    }, 2000);
  };

  const detectFacePresence = async (imageData) => {
    return new Promise((resolve) => {
      try {
        const data = imageData.data;
        let skinTonePixels = 0;
        let totalPixels = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          if (r > 95 && g > 40 && b > 20 && 
              Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
              Math.abs(r - g) > 15 && r > g && r > b) {
            skinTonePixels++;
          }
        }
        
        const skinRatio = skinTonePixels / totalPixels;
        resolve(skinRatio > 0.1);
      } catch (error) {
        console.error('Face detection error:', error);
        resolve(true);
      }
    });
  };

  const startPeriodicScreenshots = () => {
    screenshotInterval.current = setInterval(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.toBlob((blob) => {
          console.log('Proctoring screenshot taken');
        }, 'image/jpeg', 0.8);
      }
    }, 30000);
  };

  const checkTestingEnvironment = () => {
    const clues = [];
    
    if (window.screen.width < 1024 || window.screen.height < 768) {
      clues.push('unusual_screen_size');
      logSuspiciousActivity('Unusual screen size detected', 'medium');
    }
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('vmware') || 
        userAgent.includes('virtualbox') ||
        userAgent.includes('x11') ||
        userAgent.includes('remote') ||
        userAgent.includes('teamviewer') ||
        userAgent.includes('anydesk')) {
      clues.push('vm_remote_user_agent');
      logSuspiciousActivity('Possible virtual/remote environment detected', 'high');
    }
    
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timezone) {
      clues.push('no_timezone');
    }
    
    const language = navigator.language;
    if (!language) {
      clues.push('no_language');
    }
  };

  const monitorUserActivity = () => {
    if (window.sessionStorage) {
      try {
        const heartbeat = sessionStorage.getItem('proctoring_heartbeat');
        if (heartbeat && Date.now() - parseInt(heartbeat) < 1000) {
          logSuspiciousActivity('Multiple tabs detected', 'high');
          addWarning();
        }
        sessionStorage.setItem('proctoring_heartbeat', Date.now().toString());
      } catch (e) {
        logSuspiciousActivity('Session storage blocked - possible multiple tabs', 'medium');
      }
    }

    const checkDevTools = () => {
      const widthThreshold = 160;
      const heightThreshold = 160;
      
      if (window.outerWidth - window.innerWidth > widthThreshold || 
          window.outerHeight - window.innerHeight > heightThreshold) {
        return true;
      }
      return false;
    };

    if (checkDevTools()) {
      logSuspiciousActivity('Developer tools detected', 'high');
      addWarning();
    }
  };

  const addWarning = () => {
    setWarningCount(prev => {
      const newCount = prev + 1;
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      
      if (newCount >= 3) {
        handleForceSubmit();
      }
      return newCount;
    });
  };

  // IMMEDIATE TERMINATION for escape key
  const handleImmediateTermination = () => {
    logSuspiciousActivity('IMMEDIATE TERMINATION - ESCAPE KEY PRESSED', 'critical');
    setWarningCount(3);
    handleForceSubmit();
  };

  const logSuspiciousActivity = (activity, severity) => {
    const activityLog = {
      timestamp: new Date().toISOString(),
      activity,
      severity,
      warningCount: warningCount + 1,
      questionIndex: currentQuestionIndex,
      timeLeft: formatTime(timeLeft)
    };
    
    setSuspiciousActivities(prev => [...prev.slice(-99), activityLog]);
    
    if (attemptId) {
      testAPI.logSuspiciousActivity(attemptId, activityLog).catch(console.error);
    }
    
    console.log('Suspicious activity:', activityLog);
  };

  const handleForceSubmit = useCallback(async () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    
    try {
      const responses = questions.map(q => ({
        questionId: q._id,
        selectedOption: q.answered,
        timeSpent: q.timeSpent || 0
      }));

      await testAPI.submitTest(attemptId, { 
        responses,
        suspiciousActivities,
        terminated: true,
        warningCount,
        reason: 'Automated termination due to proctoring violations'
      });
      
      cleanupProctoring();
      exitFullScreen();
      
      navigate(`/test-results/${examId}/${testId}`, { 
        state: { 
          attemptId,
          terminated: true,
          warningCount,
          suspiciousActivities
        } 
      });
    } catch (error) {
      console.error('Error force submitting test:', error);
    }
  }, [attemptId, examId, testId, navigate, questions, suspiciousActivities, warningCount, isSubmitted]);

  const cleanupProctoring = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (faceDetectionInterval.current) {
      clearInterval(faceDetectionInterval.current);
    }
    if (audioMonitoringInterval.current) {
      clearInterval(audioMonitoringInterval.current);
    }
    if (activityMonitorInterval.current) {
      clearInterval(activityMonitorInterval.current);
    }
    if (screenshotInterval.current) {
      clearInterval(screenshotInterval.current);
    }
    if (fullScreenCheckInterval.current) {
      clearInterval(fullScreenCheckInterval.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  // STRICT Full-screen enforcement
  const enterFullScreen = async () => {
    try {
      const elem = document.documentElement;
      
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      
      setIsFullScreen(true);
      setFullScreenForced(true);
      
      // Disable any fullscreen exit
      document.addEventListener('fullscreenchange', preventFullScreenExit);
      document.addEventListener('webkitfullscreenchange', preventFullScreenExit);
      
    } catch (error) {
      console.error('Fullscreen error:', error);
      logSuspiciousActivity('Fullscreen activation failed', 'high');
      addWarning();
    }
  };

  const preventFullScreenExit = () => {
    if (!document.fullscreenElement && !isSubmitted) {
      console.log('Preventing fullscreen exit');
      enterFullScreen();
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (error) {
      console.error('Exit fullscreen error:', error);
    }
  };

  // Start test with STRICT proctoring
  const startTest = async () => {
    try {
      const response = await testAPI.startTest(testId);
      setAttemptId(response.data.attemptId);
      setTimeLeft(test.duration * 60);
      setShowInstructions(false);
      
      // Force fullscreen immediately
      await enterFullScreen();
      
      // Initialize proctoring
      setTimeout(() => {
        initializeProctoring();
      }, 1000);
    } catch (error) {
      setError('Failed to start test');
    }
  };

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

      await testAPI.submitTest(attemptId, { 
        responses,
        suspiciousActivities,
        warningCount
      });
      
      cleanupProctoring();
      exitFullScreen();
      
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

  // Proctoring Status Component
  const ProctoringStatus = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
        <Eye className="h-5 w-5 mr-2 text-teal-600" />
        Live Proctoring Active
        <div className={`ml-2 w-2 h-2 rounded-full ${proctoringReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        {fullScreenForced && (
          <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-300">
            Full-Screen Locked
          </div>
        )}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className={`flex items-center p-2 rounded ${cameraActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <Video className="h-4 w-4 mr-2" />
          Camera: {cameraActive ? 'Active' : 'Inactive'}
        </div>
        
        <div className={`flex items-center p-2 rounded ${microphoneActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <Mic className="h-4 w-4 mr-2" />
          Microphone: {microphoneActive ? 'Active' : 'Inactive'}
        </div>
        
        <div className={`flex items-center p-2 rounded ${faceDetected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <User className="h-4 w-4 mr-2" />
          Face: {faceDetected ? 'Detected' : 'Not Found'}
        </div>
        
        <div className={`flex items-center p-2 rounded ${noiseLevel < 50 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
          <MicOff className="h-4 w-4 mr-2" />
          Noise: {noiseLevel < 50 ? 'Low' : 'High'}
        </div>
      </div>

      {warningCount > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <div className="flex items-center justify-between">
            <span className="text-red-700 text-sm font-medium">
              Proctoring Warnings: {warningCount}/3
            </span>
            {warningCount >= 2 && (
              <span className="text-red-600 text-xs animate-pulse">
                Next violation will auto-submit test
              </span>
            )}
          </div>
        </div>
      )}

      <div className="hidden">
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Loading secure test environment...</p>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-teal-600 text-white font-bold text-xl p-2 rounded">
              QualityEdge Secure Proctoring
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">STRICT Proctored Test Environment</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Test Information</h3>
              
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
            </div>

            <div className="space-y-4 bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-bold text-lg text-red-800 mb-3">STRICT Proctoring Restrictions</h3>
              
              <div className="flex items-start">
                <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <div className="bg-white w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-red-700"><strong>FULL-SCREEN LOCKED</strong> - Cannot exit under any circumstances</span>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <div className="bg-white w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-red-700"><strong>ESCAPE KEY BLOCKED</strong> - Pressing Escape will immediately end test</span>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <div className="bg-white w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-red-700"><strong>ALL keyboard shortcuts disabled</strong> including function keys</span>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <div className="bg-white w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-red-700"><strong>3 STRIKES POLICY</strong> - Test auto-submits after 3 violations</span>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-500 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <div className="bg-white w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-red-700"><strong>Camera & Microphone required</strong> - Continuous monitoring</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-red-800 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              CRITICAL: Zero Tolerance Policy
            </h4>
            <p className="text-red-700 text-sm">
              • Pressing <strong>ESCAPE key</strong> will <strong>IMMEDIATELY TERMINATE</strong> your test<br/>
              • <strong>Full-screen mode is mandatory</strong> and cannot be exited<br/>
              • Any attempt to switch tabs/windows will be penalized<br/>
              • Test automatically submits after <strong>3 violations</strong>
            </p>
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
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Lock className="h-5 w-5 mr-2" />
              Start Strict Proctored Test
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
          <div className="bg-red-600 text-white font-bold text-lg p-1 rounded mr-4">
            SECURE MODE
          </div>
          <h1 className="text-xl font-semibold text-gray-800">{test.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} title="Face Detection"></div>
            <div className={`w-3 h-3 rounded-full ${noiseLevel < 50 ? 'bg-green-500' : 'bg-yellow-500'}`} title="Noise Level"></div>
            <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500' : 'bg-red-500'}`} title="Camera"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" title="Full-Screen Locked"></div>
          </div>
          
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
          <div className="max-w-3xl mx-auto">
            {/* Proctoring Status */}
            <ProctoringStatus />
            
            {/* Question Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
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

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                  {currentQuestion.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
        </div>

        {/* Questions Overview Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-5 overflow-y-auto hidden lg:block shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">Question Palette</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${warningCount === 0 ? 'bg-green-500' : warningCount === 1 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className="text-xs text-gray-500">Warnings: {warningCount}/3</span>
              <button 
                onClick={() => setShowLegend(!showLegend)}
                className="text-teal-600 hover:text-teal-800"
                title="Show Legend"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>
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

      {/* Enhanced Warning Modal */}
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
              <h3 className="text-xl font-bold mb-2">PROCTORING VIOLATION #{warningCount}</h3>
              <p className="mb-4">Suspicious activity detected. Your test will be automatically submitted after 3 violations.</p>
              <div className="bg-red-200 p-3 rounded-lg mb-4">
                <p className="font-medium text-sm">Last detected: {suspiciousActivities[suspiciousActivities.length - 1]?.activity}</p>
              </div>
              <p className="font-medium">Violations: {warningCount}/3</p>
              {warningCount >= 2 && (
                <p className="text-red-700 font-semibold mt-2 animate-pulse">
                  ⚠️ NEXT VIOLATION WILL AUTO-SUBMIT YOUR TEST!
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Question Navigator */}
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