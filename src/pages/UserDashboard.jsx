
import React, { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import {
  User,
  BookOpen,
  Clock,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart2,
  Bookmark,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Book
} from "lucide-react";
import { motion } from "framer-motion";
import { userAPI, authAPI } from '../services/api';
import { useNavigate } from "react-router-dom";
 


const UserDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastestTest, setLatestTest] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Close sidebar when resizing to larger screens
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
    {
      name: "Test History",
      icon: <BookOpen size={20} />,
      path: "/dashboard/history",
    },
    {
      name: "Performance",
      icon: <BarChart2 size={20} />,
      path: "/dashboard/performance",
    },
    // {
    //   name: "Saved Tests",
    //   icon: <Bookmark size={20} />,
    //   path: "/dashboard/saved",
    // },
    {
      name: "Help Center",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/help",
    },
    { name: "Take Exams", icon: <Book size={20} />, path: "/exam-test-series" },
  ];

  // Fetch user data using the API service
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await userAPI.getProfile();
      setUserData(response.data);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Fetch additional data for dashboard
  const [testHistory, setTestHistory] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [savedTests, setSavedTests] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (location.pathname === '/dashboard' && userData) {
        try {
          // Fetch test history
          const historyResponse = await userAPI.getTestHistory(1, 5);
          console.log(historyResponse.data);
          setTestHistory(historyResponse.data.testAttempts || []);
          
          // Fetch performance data
          const performanceResponse = await userAPI.getPerformance();
          console.log(performanceResponse.data);
          setPerformanceData(performanceResponse.data.overall);
          setLatestTest(historyResponse.data.testAttempts[0]?.examId?.name || null);
          
          // Fetch saved tests
          const savedResponse = await userAPI.getSavedTests();
          console.log(savedResponse.data);
          setSavedTests(savedResponse.data || []);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    };
    
    fetchDashboardData();
  }, [location.pathname, userData]);

  // Mobile sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Set active tab based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find((item) => item.path === currentPath);
    if (activeItem) {
      setActiveTab(activeItem.name.toLowerCase());
    }
  }, [location.pathname]);

  console.log("Test History:", testHistory)

  // Handle logout
  const handleLogout = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-teal-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-teal-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white shadow-lg z-30 
          transform transition-transform duration-300 ease-in-out`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || windowWidth >= 1024 ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 text-teal-700 hover:text-teal-900"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>

          {/* User Profile */}
          <div className="flex flex-col items-center py-6 px-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
            <div className="relative mb-4">
              <img
                src={userData?.avatar || "/default-avatar.png"}
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
              <div className="absolute bottom-0 right-0 bg-teal-800 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                {userData?.membership || "Free"}
              </div>
            </div>
            <h3 className="text-lg font-semibold">
              {userData?.name || "User Name"}
            </h3>
            <p className="text-sm text-white/90">{userData?.email || "user@example.com"}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-teal-100 text-teal-800 font-semibold shadow-sm"
                        : "text-teal-700 hover:bg-teal-50 hover:text-teal-900"
                    }`}
                    onClick={() => {
                      setActiveTab(item.name.toLowerCase());
                      if (windowWidth < 1024 && sidebarOpen) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className={`mr-3 ${location.pathname === item.path ? "text-teal-700" : "text-teal-600"}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 px-4 pb-4 border-t border-teal-100">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-teal-700 hover:bg-teal-50 hover:text-teal-900 rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10 border-b border-teal-100">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-teal-700 hover:text-teal-900 transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-teal-800 capitalize">
                {activeTab || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-teal-600 hover:text-teal-800 relative transition-colors">
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={userData?.avatar || "/default-avatar.png"}
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-teal-400"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-teal-800">{userData?.name || "User Name"}</p>
                  <p className="text-xs text-teal-600">{userData?.membership || "Free"} Plan</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-teal-50">
          <div className="max-w-7xl mx-auto">
            {/* Dynamic content based on route */}
            <Outlet context={{ userData, fetchUserData }} />

            {/* Default dashboard content when no subroute is active */}
            {location.pathname === "/dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <motion.div
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-teal-600 text-sm font-medium mb-1">Tests Taken</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-teal-800">
                          {performanceData?.testsTaken || 0}
                        </p>
                        <p className="text-xs text-teal-500 mt-1">Total attempts</p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <BookOpen className="text-teal-600" size={24} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-teal-600 text-sm font-medium mb-1">Average Score</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-teal-800">
                          {parseInt(performanceData?.avgScore) || 0}%
                        </p>
                        <p className="text-xs text-teal-500 mt-1">Across all tests</p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <BarChart2 className="text-teal-600" size={24} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-teal-600 text-sm font-medium mb-1">Last Test Taken</h3>
                        <p className="text-lg font-semibold text-teal-800 truncate">
                          {lastestTest || "No tests taken yet"}
                        </p>
                        <p className="text-xs text-teal-500 mt-1">Most recent attempt</p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <Clock className="text-teal-600" size={24} />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Two-column layout for bottom sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-teal-800">
                        Recent Activity
                      </h2>
                      <Link 
                        to="/dashboard/history" 
                        className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {testHistory.length > 0 ? (
                        testHistory.map((test, index) => (
                          <div
                            key={index}
                            className="flex items-start pb-4 border-b border-teal-100 last:border-0 last:pb-0"
                          >
                            <div className="bg-teal-100 p-2 rounded-lg mr-3 sm:mr-4">
                              <BookOpen className="text-teal-600" size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-teal-800 truncate">
                                {test?.examId?.name || "Unnamed Test"}
                              </h3>
                              <p className="text-sm text-teal-600">
                                {new Date(test.endTime).toLocaleDateString()} • Score: {test.score}%
                              </p>
                            </div>
                            <span className={`text-sm font-medium ml-2 ${
                              test.score >= 80 ? "text-green-600" :
                              test.score >= 60 ? "text-yellow-600" :
                              "text-red-600"
                            }`}>
                              {test.score}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                            <BookOpen className="text-teal-500" size={20} />
                          </div>
                          <p className="text-teal-600">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommended/Saved Tests */}
                  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100">
                    <h2 className="text-lg sm:text-xl font-semibold text-teal-800 mb-4 sm:mb-6">
                      Your Saved Tests
                    </h2>
                    <div className="space-y-4">
                      {savedTests.length > 0 ? (
                        savedTests.slice(0, 3).map((test, index) => (
                          <motion.div
                            key={index}
                            className="border border-teal-100 rounded-lg p-4 hover:border-teal-400 transition-colors bg-white"
                            whileHover={{ y: -2 }}
                          >
                            <div className="flex items-start mb-3">
                              <div className="bg-teal-100 p-2 rounded-lg mr-3">
                                <BookOpen className="text-teal-600" size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-teal-800 truncate">{test.examName}</h3>
                                <p className="text-sm text-teal-600 mt-1 truncate">
                                  {test.description || "No description available"}
                                </p>
                              </div>
                            </div>
                            <Link 
                              to={`/exam/${test.examId}`}
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md block text-center"
                            >
                              Start Test
                            </Link>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                            <Bookmark className="text-teal-500" size={20} />
                          </div>
                          <p className="text-teal-600">No saved tests yet</p>
                          <Link 
                            to="/exam-test-series"
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium mt-2 inline-block"
                          >
                            Browse tests
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


const Profile = () => {
  const { userData, fetchUserData } = useOutletContext();
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    mobile: userData?.mobile || "",
    education: userData?.education || "",
    address: userData?.address || "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        education: userData.education || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log(formData)
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Refresh user data
        await fetchUserData();
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100">
      <h2 className="text-xl font-semibold text-teal-800 mb-4 sm:mb-6">
        Profile Settings
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <div className="flex flex-col items-center">
            <img
              src={userData?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="User"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-teal-500 mb-4"
            />
            <button className="text-teal-600 font-medium hover:text-teal-800 transition-colors">
              Change Photo
            </button>
            <div className="mt-6 w-full">
              <h3 className="font-medium text-teal-800 mb-2">Account Status</h3>
              <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg border border-teal-200">
                {userData?.membership || "Premium"} Member
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 focus:ring-teal-500 focus:border-teal-500 placeholder-teal-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-600 focus:ring-teal-500 focus:border-teal-500 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 focus:ring-teal-500 focus:border-teal-500 placeholder-teal-400"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 focus:ring-teal-500 focus:border-teal-500 placeholder-teal-400"
                placeholder="Enter your education level"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 focus:ring-teal-500 focus:border-teal-500 placeholder-teal-400"
                placeholder="Enter your address"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const TestHistory = () => {
  const { userData } = useOutletContext();
  const [testHistory, setTestHistory] = useState({ testAttempts: [], currentPage: 1, totalPages: 0, totalTests: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        const token = localStorage.getItem("token");
      
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/test-history?page=${currentPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTestHistory(data);
        } else {
          console.error("Failed to fetch test history");
        }
        
      } catch (error) {
        console.error("Error fetching test history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, [currentPage]);

  const handleView = (test) => {
    navigate(`/test-results/${test.examId._id}/${test.testId._id}`, {
      state: { attemptId: test._id }
    });
  };

  const handleRetake = (test) => {
    navigate(`/exam-details/${test.examId._id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= testHistory.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-teal-100">
      <div className="h-8 bg-teal-100 rounded w-1/3 mb-6 animate-pulse"></div>
      
      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-teal-50 rounded-lg p-4 border border-teal-200 animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="w-2/3">
                <div className="h-5 bg-teal-100 rounded mb-2"></div>
                <div className="h-4 bg-teal-100 rounded w-3/4"></div>
              </div>
              <div className="h-6 w-10 bg-teal-100 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <div className="h-4 bg-teal-100 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-teal-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1 h-9 bg-teal-100 rounded-md"></div>
              <div className="flex-1 h-9 bg-teal-100 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-teal-200">
        <table className="min-w-full divide-y divide-teal-200">
          <thead className="bg-teal-50">
            <tr>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <th key={item} scope="col" className="px-6 py-3">
                  <div className="h-4 bg-teal-100 rounded w-3/4 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-teal-100">
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6].map((cell) => (
                  <td key={cell} className="px-6 py-4">
                    <div className="h-4 bg-teal-100 rounded w-4/5"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="bg-teal-50 px-6 py-4 flex items-center justify-between border-t border-teal-200 mt-4 animate-pulse">
        <div className="h-4 bg-teal-100 rounded w-1/4"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-teal-100 rounded-md"></div>
          <div className="h-8 w-8 bg-teal-100 rounded-md"></div>
          <div className="h-8 w-8 bg-teal-100 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-teal-100">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-teal-800 mb-4 sm:mb-6">Test History</h2>

        {testHistory.testAttempts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-teal-50 rounded-lg border border-teal-200">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-teal-800 mb-2">No test history yet</h3>
            <p className="text-teal-600 mb-4">Take your first test to see your history here.</p>
            <button 
              onClick={() => navigate('/exams')}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Browse Exams
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="md:hidden space-y-4">
              {testHistory.testAttempts.map((test) => {
                const formattedDate = new Date(test.startTime).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                
                const formattedTime = new Date(test.startTime).toLocaleString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                
                const formattedDuration = `${Math.floor(test.timeSpent / 60)}m ${test.timeSpent % 60}s`;

                return (
                  <div key={test._id} className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-teal-800">{test.examId.name}</h3>
                        <p className="text-sm text-teal-700">{test.testId.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.score >= 80 ? "bg-green-100 text-green-800" :
                        test.score >= 60 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {test.score}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-teal-600">Date</p>
                        <p className="font-medium text-teal-800">{formattedDate}</p>
                        <p className="text-teal-700">{formattedTime}</p>
                      </div>
                      <div>
                        <p className="text-teal-600">Duration</p>
                        <p className="font-medium text-teal-800">{formattedDuration}</p>
                      </div>
                      <div>
                        <p className="text-teal-600">Accuracy</p>
                        <p className="font-medium text-teal-800">{test.accuracy}%</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(test)}
                        className="flex-1 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
                      >
                        View Results
                      </button>
                      <button
                        onClick={() => handleRetake(test)}
                        className="flex-1 py-2 bg-white border border-teal-300 text-teal-700 text-sm font-medium rounded-md hover:bg-teal-50 transition-colors"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-teal-200">
              <table className="min-w-full divide-y divide-teal-200">
                <thead className="bg-teal-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Exam/Test
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-teal-100">
                  {testHistory.testAttempts.map((test) => {
                    const formattedDate = new Date(test.startTime).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const formattedDuration = `${Math.floor(test.timeSpent / 60)}m ${test.timeSpent % 60}s`;

                    return (
                      <tr key={test._id} className="hover:bg-teal-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-teal-800">{test.examId.name}</div>
                          <div className="text-sm text-teal-700">{test.testId.title}</div>
                          <div className="text-xs text-teal-600 mt-1">{test.testId.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2 w-12 rounded-full mr-2 ${
                              test.score >= 80 ? "bg-green-100" :
                              test.score >= 60 ? "bg-yellow-100" :
                              "bg-red-100"
                            }`}>
                              <div 
                                className={`h-full rounded-full ${
                                  test.score >= 80 ? "bg-green-500" :
                                  test.score >= 60 ? "bg-yellow-500" :
                                  "bg-red-500"
                                }`} 
                                style={{ width: `${test.score}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${
                              test.score >= 80 ? "text-green-700" :
                              test.score >= 60 ? "text-yellow-700" :
                              "text-red-700"
                            }`}>
                              {test.score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700">
                          {formattedDuration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-teal-800">
                            {test.accuracy}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(test)}
                              className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleRetake(test)}
                              className="px-3 py-1 bg-white border border-teal-300 text-teal-700 rounded-md hover:bg-teal-50 transition-colors"
                            >
                              Retake
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {testHistory.testAttempts.length > 0 && testHistory.totalPages > 1 && (
        <div className="bg-teal-50 px-4 sm:px-6 py-4 flex items-center justify-between border-t border-teal-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-teal-300 text-sm font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === testHistory.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-teal-300 text-sm font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-teal-600">
                Showing <span className="font-medium text-teal-800">{(currentPage - 1) * 10 + 1}</span> to{" "}
                <span className="font-medium text-teal-800">{Math.min(currentPage * 10, testHistory.totalTests)}</span> of{" "}
                <span className="font-medium text-teal-800">{testHistory.totalTests}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-teal-300 bg-white text-sm font-medium text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, testHistory.totalPages) }, (_, i) => {
                  let pageNum;
                  if (testHistory.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= testHistory.totalPages - 2) {
                    pageNum = testHistory.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-teal-600 border-teal-600 text-white'
                          : 'bg-white border-teal-300 text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === testHistory.totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-teal-300 bg-white text-sm font-medium text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Performance = () => {
  const { userData } = useOutletContext();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/performance`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPerformanceData(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch performance data");
        }
        
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // Calculate rank based on percentile
  const calculateRank = () => {
    if (!performanceData?.overall?.avgScore) return "N/A";
    const percentile = 100 - parseFloat(performanceData.overall.avgScore);
    return Math.round(percentile * 1000);
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 border border-teal-200">
            <div className="h-4 bg-teal-100 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-teal-100 rounded w-3/4 mb-4"></div>
            <div className="h-2 bg-teal-100 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-teal-200">
        <div className="h-6 bg-teal-100 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 bg-teal-100 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-teal-200">
        <div className="h-6 bg-teal-100 rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item}>
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-teal-100 rounded w-1/4"></div>
                <div className="h-4 bg-teal-100 rounded w-1/5"></div>
              </div>
              <div className="h-3 bg-teal-100 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-teal-200">
        <div className="h-6 bg-teal-100 rounded w-1/3 mb-6"></div>
        <div className="flex items-end h-48 space-x-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-teal-100 rounded-t-sm h-32"></div>
              <div className="h-3 bg-teal-100 rounded w-1/2 mt-2"></div>
              <div className="h-3 bg-teal-100 rounded w-1/3 mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-red-300">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-teal-800 mb-2">Unable to Load Performance Data</h3>
          <p className="text-teal-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-teal-200">
        <div className="text-center py-8">
          <div className="text-teal-400 text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-teal-800 mb-2">No Performance Data Available</h3>
          <p className="text-teal-600">Take some tests to see your performance metrics here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-teal-800">Performance Dashboard</h1>
        <p className="text-teal-600">Track your progress and improve your skills</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-6 border border-teal-200 hover:border-teal-400 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-teal-100 p-2 rounded-lg mr-3">
              <span className="text-teal-600">📝</span>
            </div>
            <h3 className="text-teal-700 text-sm font-medium">Tests Taken</h3>
          </div>
          <p className="text-3xl font-bold text-teal-800 mb-2">
            {performanceData.overall.testsTaken || 0}
          </p>
          <div className="mt-4 h-2 bg-teal-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${Math.min((performanceData.overall.testsTaken || 0) * 10, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-teal-200 hover:border-green-400 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <span className="text-green-600">🎯</span>
            </div>
            <h3 className="text-teal-700 text-sm font-medium">Average Score</h3>
          </div>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-teal-800 mb-2">
              {parseFloat(performanceData.overall.avgScore || 0).toFixed(1)}%
            </p>
          </div>
          <div className="mt-4 h-2 bg-teal-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${performanceData.overall.avgScore || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-teal-200 hover:border-blue-400 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <span className="text-blue-600">✓</span>
            </div>
            <h3 className="text-teal-700 text-sm font-medium">Accuracy</h3>
          </div>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-teal-800 mb-2">
              {parseFloat(performanceData.overall.accuracy || 0).toFixed(1)}%
            </p>
          </div>
          <div className="mt-4 h-2 bg-teal-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${performanceData.overall.accuracy || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-teal-200 hover:border-purple-400 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <span className="text-purple-600">🏆</span>
            </div>
            <h3 className="text-teal-700 text-sm font-medium">All India Rank</h3>
          </div>
          <p className="text-3xl font-bold text-teal-800 mb-2">
            #{calculateRank()}
          </p>
          <p className="text-sm text-teal-600">
            Top {Math.round(100 - parseFloat(performanceData.overall.avgScore || 0))}% of test takers
          </p>
        </div>
      </div>

      {/* Questions Summary */}
      <div className="bg-white rounded-xl p-6 border border-teal-200">
        <h2 className="text-xl font-semibold text-teal-800 mb-6 flex items-center">
          <span className="mr-2">📋</span> Questions Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-6 bg-teal-50 rounded-lg border border-teal-200">
            <div className="text-4xl font-bold text-teal-800">{performanceData.overall.totalQuestions || 0}</div>
            <div className="text-teal-700 text-sm mt-2">Total Questions</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-4xl font-bold text-green-700">{performanceData.overall.correctAnswers || 0}</div>
            <div className="text-green-700 text-sm mt-2">Correct Answers</div>
            <div className="text-xs text-teal-600 mt-1">
              {performanceData.overall.totalQuestions ? 
                Math.round((performanceData.overall.correctAnswers / performanceData.overall.totalQuestions) * 100) : 0
              }% of total
            </div>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-4xl font-bold text-red-700">{performanceData.overall.incorrectAnswers || 0}</div>
            <div className="text-red-700 text-sm mt-2">Incorrect Answers</div>
            <div className="text-xs text-teal-600 mt-1">
              {performanceData.overall.totalQuestions ? 
                Math.round((performanceData.overall.incorrectAnswers / performanceData.overall.totalQuestions) * 100) : 0
              }% of total
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-xl p-6 border border-teal-200">
        <h2 className="text-xl font-semibold text-teal-800 mb-6 flex items-center">
          <span className="mr-2">📚</span> Subject-wise Performance
        </h2>
        <div className="space-y-6">
          {performanceData.subjects && performanceData.subjects.length > 0 ? (
            performanceData.subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium text-teal-800">{subject.subject}</h3>
                    <p className="text-sm text-teal-600">
                      {subject.correct || 0}/{subject.total || 0} correct • {subject.attempts || 0} attempts
                    </p>
                  </div>
                  <span className={`text-lg font-semibold ${
                    parseFloat(subject.percentage) >= 70 ? 'text-green-700' : 
                    parseFloat(subject.percentage) >= 50 ? 'text-yellow-700' : 'text-red-700'
                  }`}>
                    {parseFloat(subject.percentage || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      parseFloat(subject.percentage) >= 70 ? 'bg-green-500' : 
                      parseFloat(subject.percentage) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-teal-600 text-center py-8">No subject data available</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {performanceData.overall.avgScore < 70 && (
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h2 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
            <span className="mr-2">💡</span> Improvement Tips
          </h2>
          <ul className="list-disc list-inside text-teal-700 space-y-2">
            <li>Focus on subjects with lower accuracy rates</li>
            <li>Take more practice tests to improve your timing</li>
            <li>Review incorrect answers to understand patterns</li>
            <li>Consider studying fundamental concepts in weaker areas</li>
          </ul>
        </div>
      )}
    </div>
  );
};


const SavedTests = () => {
  const { userData } = useOutletContext();
  const [savedTests, setSavedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedTests = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/saved-tests`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedTests(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch saved tests");
        }
      } catch (error) {
        console.error("Error fetching saved tests:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTests();
  }, []);

  const removeSavedTest = async (testId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/saved-tests/${testId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedTests(savedTests.filter(test => test.id !== testId));
      } else {
        console.error("Failed to remove saved test");
      }
    } catch (error) {
      console.error("Error removing saved test:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-teal-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Saved Tests
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-teal-200 rounded-lg p-4 bg-white">
              <div className="animate-pulse">
                <div className="h-5 bg-teal-100 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-teal-100 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-teal-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-red-300">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Saved Tests</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-teal-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📁</span> Saved Tests
        </h2>

        {savedTests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl text-teal-300 mb-4">📑</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No saved tests yet
            </h3>
            <p className="text-gray-600">
              Save tests to access them later from here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedTests.map((test) => (
              <div
                key={test.id}
                className="border border-teal-200 rounded-lg p-4 bg-white hover:border-teal-500 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-medium text-gray-800">{test.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded border border-teal-200">
                        {test.category}
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded border border-teal-200">
                        {test.questions} Questions
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded border border-teal-200">
                        {test.duration}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          test.difficulty === "Easy"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : test.difficulty === "Moderate"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                      <span className="mr-1">▶️</span> Start Test
                    </button>
                    <button 
                      onClick={() => removeSavedTest(test.id)}
                      className="border border-teal-300 hover:bg-teal-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <span className="mr-1">🗑️</span> Remove
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-teal-200 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="mr-1">📅</span> Saved on {test.savedOn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// Achievements Component
const Achievements = () => {
  const { userData } = useOutletContext();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/achievements`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAchievements(data);
        } else {
          console.error("Failed to fetch achievements");
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Your Achievements
      </h2>

      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <Award size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No achievements yet
          </h3>
          <p className="text-gray-500">
            Complete tests and challenges to earn achievements.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border rounded-lg p-4 ${
                achievement.unlocked
                  ? "border-primary-200 bg-primary-50"
                  : "border-gray-200 bg-gray-50 opacity-70"
              }`}
            >
              <div className="flex items-start">
                <span className="text-3xl mr-3">{achievement.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Unlocked on {achievement.date}
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const HelpCenter = () => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on 'Forgot Password' on the login page. A password reset link will be sent to your registered email address.",
    },
    {
      id: 2,
      question: "Can I retake a test?",
      answer:
        "Yes, most tests can be retaken. However, some premium tests may have restrictions on the number of attempts.",
    },
    {
      id: 3,
      question: "How are percentiles calculated?",
      answer:
        "Percentiles are calculated based on the performance of all users who have taken the same test. Being in the 90th percentile means you scored better than 90% of test takers.",
    },
    {
      id: 4,
      question: "Where can I find my test results?",
      answer:
        "All your test results are available in the 'Test History' section of your dashboard. Detailed solutions are provided for each question.",
    },
    {
      id: 5,
      question: "How do I upgrade my membership?",
      answer:
        "You can upgrade your membership by visiting the 'Settings' section and selecting 'Upgrade Membership'. Various plans are available with different features.",
    }
  ]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setError(null);
        setFaqs(faqs)
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-teal-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Help Center</h2>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-teal-100 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-teal-100 rounded mb-6"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-16 bg-teal-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-red-300">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Help Center</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-teal-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">❓</span> Help Center
      </h2>

      <div className="space-y-6">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
          <h3 className="font-medium text-teal-800 mb-2 flex items-center">
            <span className="mr-2">💬</span> Need immediate assistance?
          </h3>
          <p className="text-sm text-teal-700 mb-4">
            Our support team is available 24/7 to help you with any issues.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
            <span className="mr-2">📧</span> Contact Support
          </button>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📋</span> Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-teal-200 rounded-lg overflow-hidden bg-white hover:border-teal-500 transition-colors"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-teal-50 transition-colors"
                  onClick={() =>
                    setActiveFaq(activeFaq === faq.id ? null : faq.id)
                  }
                >
                  <span className="font-medium text-gray-800 text-left">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-teal-600 transform transition-transform ${
                      activeFaq === faq.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFaq === faq.id && (
                  <div className="p-4 pt-0 text-gray-600 bg-teal-50 border-t border-teal-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Resources */}
        <div className="mt-8 pt-6 border-t border-teal-200">
          <h3 className="font-medium text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔍</span> Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 hover:border-teal-500 transition-colors">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="mr-2">📖</span> User Guides
              </h4>
              <p className="text-sm text-gray-600">
                Comprehensive guides to help you make the most of our platform.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 hover:border-teal-500 transition-colors">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="mr-2">🎥</span> Video Tutorials
              </h4>
              <p className="text-sm text-gray-600">
                Watch step-by-step tutorials for all platform features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  UserDashboard as default,
  Profile,
  TestHistory,
  Performance,
  SavedTests,
  Achievements,
  HelpCenter,
  Settings
};
