import React, { useState , useEffect } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

const UserDashboard = () => {
  // print localstorage
  // console.log(localStorage.getItem("token"));
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample user data
  const userData = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    membership: "Premium",
    testsTaken: 12,
    avgScore: 78,
    lastTest: "SSC CGL Mock Test 5",
  };



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
    {
      name: "Saved Tests",
      icon: <Bookmark size={20} />,
      path: "/dashboard/saved",
    },
    {
      name: "Upcoming Tests",
      icon: <Clock size={20} />,
      path: "/dashboard/upcoming",
    },
    {
      name: "Achievements",
      icon: <Award size={20} />,
      path: "/dashboard/achievements",
    },
    {
      name: "Help Center",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/help",
    },
    // {
    //   name: "Settings",
    //   icon: <Settings size={20} />,
    //   path: "/dashboard/settings",
    // },
  ];

  // Mobile sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Set active tab based on current path
  React.useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find((item) => item.path === currentPath);
    if (activeItem) {
      setActiveTab(activeItem.name.toLowerCase());
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed lg:relative text-black inset-y-0 left-0 w-64 bg-white shadow-lg z-30 
    transform transition-transform duration-300 ease-in-out`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button for mobile */}
          <button
            className="lg:hidden self-end p-2 text-gray-500 hover:text-gray-700"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>

          {/* User Profile */}
          <div className="flex flex-col items-center py-6 border-b border-gray-200">
            <div className="relative mb-4">
              <img
                src={userData.avatar}
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
              />
              <div className="absolute bottom-0 right-0 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                {userData.membership}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {userData.name}
            </h3>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveTab(item.name.toLowerCase());
                      if (window.innerWidth < 1024 && sidebarOpen)
                        toggleSidebar();
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
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
              <div className="flex items-center">
                <img
                  src={userData.avatar}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <span className="text-sm font-medium">{userData.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Dynamic content based on route */}
            <Outlet context={{ userData }} />

            {/* Default dashboard content when no subroute is active */}
            {location.pathname === "/dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <motion.div
                  className="bg-white rounded-xl shadow-sm p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 mb-1">Tests Taken</h3>
                      <p className="text-3xl font-bold text-gray-800">
                        {userData.testsTaken}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BookOpen className="text-blue-600" size={24} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-sm p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 mb-1">Average Score</h3>
                      <p className="text-3xl font-bold text-gray-800">
                        {userData.avgScore}%
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Award className="text-green-600" size={24} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-sm p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 mb-1">Last Test Taken</h3>
                      <p className="text-lg font-semibold text-gray-800 truncate">
                        {userData.lastTest}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Clock className="text-purple-600" size={24} />
                    </div>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <BookOpen className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Completed SSC CGL Mock Test {item}
                          </h3>
                          <p className="text-sm text-gray-500">
                            2 days ago • Score: {75 + item}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Tests */}
                <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Recommended For You
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      "SSC CHSL Full Test",
                      "Quant Speed Test",
                      "GK Daily Quiz",
                    ].map((test, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-start mb-3">
                          <div className="bg-primary-100 p-2 rounded-lg mr-3">
                            <BookOpen className="text-primary-600" size={18} />
                          </div>
                          <h3 className="font-medium text-gray-800">{test}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Based on your performance in similar tests
                        </p>
                        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                          Start Test
                        </button>
                      </motion.div>
                    ))}
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

// Profile Component
const Profile = () => {
  const { userData } = useOutletContext();
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: "+91 9876543210",
    education: "Bachelor of Engineering",
    address: "Mumbai, India",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Profile Settings
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <img
              src={userData.avatar}
              alt="User"
              className="w-32 h-32 rounded-full object-cover border-2 border-primary-500 mb-4"
            />
            <button className="text-primary-600 font-medium">
              Change Photo
            </button>
            <div className="mt-6 w-full">
              <h3 className="font-medium text-gray-800 mb-2">Account Status</h3>
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
                {userData.membership} Member
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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

// Test History Component
const TestHistory = () => {
  const testHistory = [
    {
      id: 1,
      name: "SSC CGL Mock Test 5",
      date: "2023-06-15",
      score: 82,
      duration: "118 mins",
      correct: 41,
      incorrect: 9,
      percentile: 92,
    },
    {
      id: 2,
      name: "Quantitative Aptitude Speed Test",
      date: "2023-06-12",
      score: 78,
      duration: "45 mins",
      correct: 39,
      incorrect: 11,
      percentile: 85,
    },
    {
      id: 3,
      name: "General Knowledge Daily Quiz",
      date: "2023-06-10",
      score: 65,
      duration: "20 mins",
      correct: 13,
      incorrect: 7,
      percentile: 72,
    },
    {
      id: 4,
      name: "SSC CHSL Full Length Test",
      date: "2023-06-05",
      score: 75,
      duration: "90 mins",
      correct: 75,
      incorrect: 25,
      percentile: 80,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Test History
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Test Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Percentile
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testHistory.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{test.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {test.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.score >= 80
                          ? "bg-green-100 text-green-800"
                          : test.score >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {test.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      Top {test.percentile}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Retake
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">4</span> of{" "}
              <span className="font-medium">12</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                aria-current="page"
                className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                2
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance Component
const Performance = () => {
  const performanceData = {
    overall: {
      percentile: 85,
      accuracy: 78,
      speed: 65,
      rank: 1200,
    },
    subjects: [
      { name: "Quantitative Aptitude", score: 82, percentile: 88 },
      { name: "General Awareness", score: 75, percentile: 79 },
      { name: "English Language", score: 68, percentile: 72 },
      { name: "Logical Reasoning", score: 80, percentile: 85 },
    ],
    improvement: [
      { month: "Jan", score: 65 },
      { month: "Feb", score: 68 },
      { month: "Mar", score: 72 },
      { month: "Apr", score: 75 },
      { month: "May", score: 78 },
      { month: "Jun", score: 82 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 mb-1">Overall Percentile</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-gray-800">
              {performanceData.overall.percentile}
            </p>
            <span className="text-lg text-gray-500 ml-1">/100</span>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500"
              style={{ width: `${performanceData.overall.percentile}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 mb-1">Accuracy</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-gray-800">
              {performanceData.overall.accuracy}%
            </p>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${performanceData.overall.accuracy}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 mb-1">Speed</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-gray-800">
              {performanceData.overall.speed}%
            </p>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${performanceData.overall.speed}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 mb-1">All India Rank</h3>
          <p className="text-3xl font-bold text-gray-800">
            #{performanceData.overall.rank}
          </p>
          <p className="text-sm text-gray-500 mt-2">Top 15% of test takers</p>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Subject-wise Performance
        </h2>
        <div className="space-y-6">
          {performanceData.subjects.map((subject, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-gray-800">{subject.name}</h3>
                <span className="text-gray-600">
                  {subject.score}% (Top {subject.percentile}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500"
                  style={{ width: `${subject.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Graph */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Improvement
        </h2>
        <div className="flex items-end h-64 space-x-2">
          {performanceData.improvement.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary-500 rounded-t-sm"
                style={{ height: `${(data.score / 100) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              <span className="text-xs font-medium">{data.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Saved Tests Component
const SavedTests = () => {
  const savedTests = [
    {
      id: 1,
      name: "SSC CGL Tier 1 Full Test",
      category: "Full Length Test",
      questions: 100,
      duration: "120 mins",
      difficulty: "Moderate",
      savedOn: "2023-06-10",
    },
    {
      id: 2,
      name: "Quantitative Aptitude Advanced",
      category: "Sectional Test",
      questions: 50,
      duration: "60 mins",
      difficulty: "Hard",
      savedOn: "2023-06-05",
    },
    {
      id: 3,
      name: "General Awareness Weekly",
      category: "Daily Quiz",
      questions: 20,
      duration: "15 mins",
      difficulty: "Easy",
      savedOn: "2023-05-28",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Saved Tests
        </h2>

        <div className="space-y-4">
          {savedTests.map((test) => (
            <div
              key={test.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-medium text-gray-800">{test.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {test.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {test.questions} Questions
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {test.duration}
                    </span>
                    <span
                      className={`${
                        test.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : test.difficulty === "Moderate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      } text-xs px-2 py-1 rounded`}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Start Test
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                Saved on {test.savedOn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Upcoming Tests Component
const UpcomingTests = () => {
  const upcomingTests = [
    {
      id: 1,
      name: "SSC CGL Tier 1 Mock Test Series",
      date: "2023-07-05",
      time: "10:00 AM",
      duration: "120 mins",
      registered: true,
    },
    {
      id: 2,
      name: "Bank PO Prelims Challenge",
      date: "2023-07-12",
      time: "11:30 AM",
      duration: "60 mins",
      registered: false,
    },
    {
      id: 3,
      name: "Railway NTPC Mega Test",
      date: "2023-07-20",
      time: "09:00 AM",
      duration: "90 mins",
      registered: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Upcoming Tests
        </h2>

        <div className="space-y-4">
          {upcomingTests.map((test) => (
            <div
              key={test.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-medium text-gray-800">{test.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {test.date} at {test.time}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {test.duration}
                    </span>
                    <span
                      className={`${
                        test.registered
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      } text-xs px-2 py-1 rounded`}
                    >
                      {test.registered ? "Registered" : "Open for Registration"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {test.registered ? (
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  ) : (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Register Now
                    </button>
                  )}
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Achievements Component
const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "Perfect Score",
      description: "Scored 100% in a test",
      icon: "🏆",
      unlocked: true,
      date: "2023-05-15",
    },
    {
      id: 2,
      title: "Speed Master",
      description: "Completed a test in half the allotted time",
      icon: "⚡",
      unlocked: true,
      date: "2023-06-02",
    },
    {
      id: 3,
      title: "Consistent Performer",
      description: "Scored above 80% in 5 consecutive tests",
      icon: "📈",
      unlocked: false,
    },
    {
      id: 4,
      title: "Subject Expert",
      description: "Score above 90% in any subject",
      icon: "🎯",
      unlocked: false,
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Complete a test within first 24 hours of release",
      icon: "🐦",
      unlocked: true,
      date: "2023-06-10",
    },
    {
      id: 6,
      title: "Top 1%",
      description: "Achieve 99+ percentile in any test",
      icon: "🥇",
      unlocked: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Your Achievements
      </h2>

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
    </div>
  );
};

// Help Center Component
const HelpCenter = () => {
  const faqs = [
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
    },
  ];

  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Help Center</h2>

      <div className="space-y-4">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h3 className="font-medium text-primary-800 mb-2">
            Need immediate assistance?
          </h3>
          <p className="text-sm text-primary-700 mb-3">
            Our support team is available 24/7 to help you with any issues.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Contact Support
          </button>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setActiveFaq(activeFaq === faq.id ? null : faq.id)
                  }
                >
                  <span className="font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
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
                  <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Component
// const Settings = () => {
//   const [activeTab, setActiveTab] = useState('account');
//   const [notifications, setNotifications] = useState({
//     email: true,
//     push: true,
//     sms: false,
//     reminders: true
//   });

//   const handleNotificationChange = (e) => {
//     const { name, checked } = e.target;
//     setNotifications(prev => ({ ...prev, [name]: checked }));
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//       <div className="flex flex-col md:flex-row">
//         {/* Settings Sidebar */}
//         <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
//           <div className="p-4">
//             <h3 className="font-medium text-gray-800 mb-4">Settings</h3>
//             <nav className="space-y-1">
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'account' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('account')}
//               >
//                 Account
//               </button>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('notifications')}
//               >
//                 Notifications
//               </button>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'privacy' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('privacy')}
//               >
//                 Privacy & Security
//               </button>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('billing')}
//               >
//                 Billing
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Settings Content */}
//         <div className="flex-1 p-6">
//           {activeTab === 'account' && (
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Personal Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                       <input
//                         type="text"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//                         defaultValue="Rahul"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                       <input
//                         type="text"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//                         defaultValue="Sharma"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Email Address</h3>
//                   <div className="flex items-center">
//                     <input
//                       type="email"
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//                       defaultValue="rahul.sharma@example.com"
//                     />
//                     <button className="ml-3 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                       Change
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Password</h3>
//                   <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                     Change Password
//                   </button>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
//                     Delete Account
//                   </button>
//                   <p className="text-xs text-gray-500 mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'notifications' && (
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Email Notifications</h3>
//                   <div className="space-y-3">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="email"
//                         checked={notifications.email}
//                         onChange={handleNotificationChange}
//                         className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-700">Receive email notifications</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="reminders"
//                         checked={notifications.reminders}
//                         onChange={handleNotificationChange}
//                         className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-700">Test reminders and updates</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Push Notifications</h3>
//                   <div className="space-y-3">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="push"
//                         checked={notifications.push}
//                         onChange={handleNotificationChange}
//                         className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-700">Enable push notifications</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">SMS Notifications</h3>
//                   <div className="space-y-3">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="sms"
//                         checked={notifications.sms}
//                         onChange={handleNotificationChange}
//                         className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-700">Receive important updates via SMS</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
//                     Save Preferences
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'privacy' && (
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Privacy & Security</h2>
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Data Privacy</h3>
//                   <p className="text-gray-600 mb-4">
//                     We respect your privacy and are committed to protecting your personal data.
//                     This section lets you control how we collect, use, and share your information.
//                   </p>
//                   <label className="flex items-start">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
//                       defaultChecked
//                     />
//                     <span className="ml-2 text-gray-700">
//                       Allow analytics to improve my experience (anonymous data only)
//                     </span>
//                   </label>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Security</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <h4 className="font-medium text-gray-800">Two-factor Authentication</h4>
//                         <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
//                       </div>
//                       <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                         Enable
//                       </button>
//                     </div>

//                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <h4 className="font-medium text-gray-800">Active Sessions</h4>
//                         <p className="text-sm text-gray-600">View and manage your logged-in devices</p>
//                       </div>
//                       <button className="text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors">
//                         Manage
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
//                     Save Settings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'billing' && (
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Billing & Subscription</h2>
//               <div className="space-y-6">
//                 <div className="border border-gray-200 rounded-lg p-6">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-medium text-gray-800">Premium Membership</h3>
//                       <p className="text-gray-600">Renews on July 30, 2023</p>
//                     </div>
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                       Active
//                     </span>
//                   </div>
//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <h4 className="text-sm text-gray-500 mb-1">Plan</h4>
//                       <p className="font-medium">Annual</p>
//                     </div>
//                     <div>
//                       <h4 className="text-sm text-gray-500 mb-1">Price</h4>
//                       <p className="font-medium">₹2,999/year</p>
//                     </div>
//                     <div>
//                       <h4 className="text-sm text-gray-500 mb-1">Payment Method</h4>
//                       <p className="font-medium">VISA •••• 4242</p>
//                     </div>
//                   </div>
//                   <div className="mt-6 flex space-x-3">
//                     <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                       Update Payment Method
//                     </button>
//                     <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                       Cancel Subscription
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Billing History</h3>
//                   <div className="border border-gray-200 rounded-lg overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Description
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Amount
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Status
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         <tr>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             2023-06-30
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             Premium Membership Renewal
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             ₹2,999.00
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
//                               Paid
//                             </span>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             2022-06-30
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             Premium Membership
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             ₹2,999.00
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
//                               Paid
//                             </span>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


export {
  UserDashboard as default,
  Profile,
  TestHistory,
  Performance,
  SavedTests,
  UpcomingTests,
  Achievements,
  HelpCenter,
  Settings,
};
