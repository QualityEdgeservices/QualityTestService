
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
    {
      name: "Saved Tests",
      icon: <Bookmark size={20} />,
      path: "/dashboard/saved",
    },
    
    {
      name: "Help Center",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/help",
    },
  ];

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login if no token
        window.location.href = "/login";
        return;
      }

      // Mock API call for demonstration
      // setTimeout(() => {
      //   setUserData({
      //     name: "Alex Johnson",
      //     email: "alex.johnson@example.com",
      //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      //     membership: "Premium",
      //     testsTaken: 12,
      //     avgScore: 78,
      //     lastTest: "Mathematics Advanced",
      //     recentActivity: [
      //       { testName: "Physics Test", date: "2 days ago", score: 85 },
      //       { testName: "Chemistry Quiz", date: "5 days ago", score: 72 },
      //       { testName: "Math Assessment", date: "1 week ago", score: 90 }
      //     ],
      //     recommendedTests: [
      //       { 
      //         name: "Biology Practice Test", 
      //         description: "Covers cellular biology and genetics" 
      //       },
      //       { 
      //         name: "English Literature", 
      //         description: "Poetry analysis and literary devices" 
      //       }
      //     ]
      //   });
      //   setLoading(false);
      // }, 1000);
      
      // In a real application, you would use the actual API call:
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        // Handle unauthorized access
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-teal-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed lg:relative inset-y-0 left-0 w-64 bg-gray-800 shadow-xl z-30 
          transform transition-transform duration-300 ease-in-out`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || windowWidth >= 1024 ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>

          {/* User Profile */}
          <div className="flex flex-col items-center py-6 px-4 bg-gradient-to-r from-teal-700 to-teal-600 text-white">
            <div className="relative mb-4">
              <img
                src={userData?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
              <div className="absolute bottom-0 right-0 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                {userData?.membership || "Premium"}
              </div>
            </div>
            <h3 className="text-lg font-semibold">
              {userData?.name || "User Name"}
            </h3>
            <p className="text-sm text-white/80">{userData?.email || "user@example.com"}</p>
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
                        ? "bg-teal-900 text-teal-400 font-semibold shadow-sm"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => {
                      setActiveTab(item.name.toLowerCase());
                      if (windowWidth < 1024 && sidebarOpen) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className={`mr-3 ${location.pathname === item.path ? "text-teal-400" : "text-gray-400"}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 px-4 pb-4 border-t border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
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
        <header className="bg-gray-800 shadow-sm z-10 border-b border-gray-700">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-300 hover:text-teal-400 transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-white capitalize">
                {activeTab || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-teal-400 relative transition-colors">
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
                  src={userData?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-teal-500/30"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-white">{userData?.name || "User Name"}</p>
                  <p className="text-xs text-gray-400">{userData?.membership || "Premium"} Plan</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Dynamic content based on route */}
            <Outlet context={{ userData, fetchUserData }} />

            {/* Default dashboard content when no subroute is active */}
            {location.pathname === "/dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <motion.div
                    className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Tests Taken</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {userData?.testsTaken || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total attempts</p>
                      </div>
                      <div className="bg-teal-900 p-3 rounded-lg">
                        <BookOpen className="text-teal-400" size={24} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Average Score</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {userData?.avgScore.toFixed(2) || 0}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Across all tests</p>
                      </div>
                      <div className="bg-teal-900 p-3 rounded-lg">
                        <BarChart2 className="text-teal-400" size={24} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Last Test Taken</h3>
                        <p className="text-lg font-semibold text-white truncate">
                          {userData?.lastTest || "No tests taken yet"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Most recent attempt</p>
                      </div>
                      <div className="bg-teal-900 p-3 rounded-lg">
                        <Clock className="text-teal-400" size={24} />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Two-column layout for bottom sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Recent Activity */}
                  <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">
                        Recent Activity
                      </h2>
                      <Link 
                        to="/dashboard/history" 
                        className="text-sm text-teal-400 hover:text-teal-300 font-medium"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {userData?.recentActivity?.length > 0 ? (
                        userData.recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                          >
                            <div className="bg-teal-900 p-2 rounded-lg mr-3 sm:mr-4">
                              <BookOpen className="text-teal-400" size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white truncate">
                                {activity.testName}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {activity.date} • Score: {activity.score}%
                              </p>
                            </div>
                            <span className={`text-sm font-medium ml-2 ${
                              activity.score >= 80 ? "text-green-400" :
                              activity.score >= 60 ? "text-yellow-400" :
                              "text-red-400"
                            }`}>
                              {activity.score}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                            <BookOpen className="text-gray-500" size={20} />
                          </div>
                          <p className="text-gray-500">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommended Tests */}
                  <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                      Recommended For You
                    </h2>
                    <div className="space-y-4">
                      {userData?.recommendedTests?.length > 0 ? (
                        userData.recommendedTests.map((test, index) => (
                          <motion.div
                            key={index}
                            className="border border-gray-700 rounded-lg p-4 hover:border-teal-500 transition-colors bg-gray-800"
                            whileHover={{ y: -2 }}
                          >
                            <div className="flex items-start mb-3">
                              <div className="bg-teal-900 p-2 rounded-lg mr-3">
                                <BookOpen className="text-teal-400" size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">{test.name}</h3>
                                <p className="text-sm text-gray-400 mt-1 truncate">
                                  {test.description}
                                </p>
                              </div>
                            </div>
                            <button className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                              Start Test
                            </button>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                            <BookOpen className="text-gray-500" size={20} />
                          </div>
                          <p className="text-gray-500">No recommendations available</p>
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



// const Profile = () => {
//   const { userData, fetchUserData } = useOutletContext();
//   const [formData, setFormData] = useState({
//     name: userData?.name || "",
//     email: userData?.email || "",
//     mobile: userData?.mobile || "",
//     education: userData?.education || "",
//     address: userData?.address || "",
//   });

//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         name: userData.name || "",
//         email: userData.email || "",
//         mobile: userData.mobile || "",
//         education: userData.education || "",
//         address: userData.address || "",
//       });
//     }
//   }, [userData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       console.log(formData)
//       const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log(data);


//       if (response.ok) {
//         // Refresh user data
//         await fetchUserData();
//         alert("Profile updated successfully!");
//       } else {
//         alert("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Error updating profile");
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">
//         Profile Settings
//       </h2>

//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="md:w-1/3">
//           <div className="flex flex-col items-center">
//             <img
//               src={userData?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
//               alt="User"
//               className="w-32 h-32 rounded-full object-cover border-2 border-primary-500 mb-4"
//             />
//             <button className="text-primary-600 font-medium">
//               Change Photo
//             </button>
//             <div className="mt-6 w-full">
//               <h3 className="font-medium text-gray-800 mb-2">Account Status</h3>
//               <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
//                 {userData?.membership || "Premium"} Member
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="md:w-2/3">
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//                   disabled
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Education
//               </label>
//               <input
//                 type="text"
//                 name="education"
//                 value={formData.education}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Address
//               </label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
//               ></textarea>
//             </div>

//             <div className="flex justify-end pt-4">
//               <button
//                 type="submit"
//                 className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// Test History Component
// const TestHistory = () => {
//   const { userData } = useOutletContext();
//   const [testHistory, setTestHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTestHistory = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/test-history`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setTestHistory(data);
//         } else {
//           console.error("Failed to fetch test history");
//         }
//       } catch (error) {
//         console.error("Error fetching test history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestHistory();
//   }, []);
//   console.log(testHistory)

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Test History
//         </h2>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//       <div className="p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Test History
//         </h2>

//         {testHistory.length === 0 ? (
//           <div className="text-center py-12">
//             <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium text-gray-800 mb-2">
//               No test history yet
//             </h3>
//             <p className="text-gray-500">
//               Take your first test to see your history here.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Test Name
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Score
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Duration
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Percentile
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {testHistory.length > 0 ? (
//     testHistory.map((test) => {
//       // Format date
//       const formattedDate = new Date(test.date).toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       // Format duration (if in seconds)
//       const formattedDuration =
//         typeof test.duration === "number"
//           ? `${Math.floor(test.duration / 60)}m ${test.duration % 60}s`
//           : test.duration;

//       return (
//         <tr key={test.id || test._id} className="hover:bg-gray-50">
//           {/* Test Name */}
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="font-medium text-gray-900">{test.name}</div>
//           </td>

//           {/* Date */}
//           <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//             {formattedDate}
//           </td>

//           {/* Score with colors */}
//           <td className="px-6 py-4 whitespace-nowrap">
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 test.score >= 80
//                   ? "bg-green-100 text-green-800"
//                   : test.score >= 60
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               {test.score}%
//             </span>
//           </td>

//           {/* Duration */}
//           <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//             {formattedDuration}
//           </td>

//           {/* Percentile */}
//           <td className="px-6 py-4 whitespace-nowrap">
//             <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
//               Top {test.percentile}%
//             </span>
//           </td>

//           {/* Actions */}
//           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//             <button
//               onClick={() => handleView(test)}
//               className="text-primary-600 hover:text-primary-900 mr-3"
//             >
//               View
//             </button>
//             <button
//               onClick={() => handleRetake(test)}
//               className="text-gray-600 hover:text-gray-900"
//             >
//               Retake
//             </button>
//           </td>
//         </tr>
//       );
//     })
//   ) : (
//     <tr>
//       <td
//         colSpan="6"
//         className="text-center py-6 text-gray-500 italic"
//       >
//         No test history available.
//       </td>
//     </tr>
//   )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {testHistory.length > 0 && (
//         <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//               Previous
//             </button>
//             <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">1</span> to{" "}
//                 <span className="font-medium">{testHistory.length}</span> of{" "}
//                 <span className="font-medium">{testHistory.length}</span> results
//               </p>
//             </div>
//             <div>
//               <nav
//                 className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                 aria-label="Pagination"
//               >
//                 <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                   <span className="sr-only">Previous</span>
//                   <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//                 </button>
//                 <button
//                   aria-current="page"
//                   className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
//                 >
//                   1
//                 </button>
//                 <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                   <span className="sr-only">Next</span>
//                   <ChevronRight className="h-5 w-5" aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// const TestHistory = () => {
//   const { userData } = useOutletContext();
//   const [testHistory, setTestHistory] = useState({ testAttempts: [], currentPage: 1, totalPages: 0, totalTests: 0 });
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchTestHistory = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/test-history?page=${currentPage}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setTestHistory(data);
//         } else {
//           console.error("Failed to fetch test history");
//         }
//       } catch (error) {
//         console.error("Error fetching test history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestHistory();
//   }, [currentPage]);

//   const handleView = (test) => {
//     // Navigate to test results page
//     console.log("View test:", test);
//     // console.log(`/test-results/${test.examId._id}/${test.testId._id}`)
//     navigate(`/test-results/${test.examId._id}/${test.testId._id}`,{
//       state: { attemptId: test._id }
//     });
//   };

//   const handleRetake = (test) => {
//     // Navigate to test taking page
//     console.log("Retake test:", test);
//     navigate(`/exam-details/${test.examId._id}`);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= testHistory.totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Test History
//         </h2>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//       <div className="p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Test History
//         </h2>

//         {testHistory.testAttempts.length === 0 ? (
//           <div className="text-center py-12">
//             <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium text-gray-800 mb-2">
//               No test history yet
//             </h3>
//             <p className="text-gray-500">
//               Take your first test to see your history here.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Exam
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Test
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Score
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Duration
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Accuracy
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Percentile
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {testHistory.testAttempts.map((test) => {
//                   // Format date
//                   const formattedDate = new Date(test.startTime).toLocaleString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   });

//                   // Format duration
//                   const formattedDuration = `${Math.floor(test.timeSpent / 60)}m ${test.timeSpent % 60}s`;

//                   return (
//                     <tr key={test._id} className="hover:bg-gray-50">
//                       {/* Exam Name */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">{test.examId.name}</div>
//                       </td>

//                       {/* Test Name */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-900">{test.testId.title}</div>
//                         <div className="text-xs text-gray-500">{test.testId.category}</div>
//                       </td>

//                       {/* Date */}
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                         {formattedDate}
//                       </td>

//                       {/* Score with colors */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             test.score >= 80
//                               ? "bg-green-100 text-green-800"
//                               : test.score >= 60
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {test.score}%
//                         </span>
//                       </td>

//                       {/* Duration */}
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                         {formattedDuration}
//                       </td>

//                       {/* Accuracy */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-gray-900 font-medium">
//                           {test.accuracy}%
//                         </span>
//                       </td>

//                       {/* Percentile */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
//                           Top {test.percentile}%
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleView(test)}
//                           className="text-primary-600 hover:text-primary-900 mr-3"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleRetake(test)}
//                           className="text-gray-600 hover:text-gray-900"
//                         >
//                           Retake
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {testHistory.testAttempts.length > 0 && testHistory.totalPages > 1 && (
//         <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button 
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <button 
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === testHistory.totalPages}
//               className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
//                 <span className="font-medium">{Math.min(currentPage * 10, testHistory.totalTests)}</span> of{" "}
//                 <span className="font-medium">{testHistory.totalTests}</span> results
//               </p>
//             </div>
//             <div>
//               <nav
//                 className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                 aria-label="Pagination"
//               >
//                 <button 
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="sr-only">Previous</span>
//                   <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//                 </button>
                
//                 {Array.from({ length: Math.min(5, testHistory.totalPages) }, (_, i) => {
//                   const pageNum = i + 1;
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePageChange(pageNum)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         currentPage === pageNum
//                           ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
                
//                 <button 
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === testHistory.totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="sr-only">Next</span>
//                   <ChevronRight className="h-5 w-5" aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

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
    <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 sm:mb-6">
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
            <button className="text-teal-400 font-medium hover:text-teal-300 transition-colors">
              Change Photo
            </button>
            <div className="mt-6 w-full">
              <h3 className="font-medium text-white mb-2">Account Status</h3>
              <div className="bg-teal-900 text-teal-400 px-4 py-2 rounded-lg border border-teal-800">
                {userData?.membership || "Premium"} Member
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 focus:ring-teal-500 focus:border-teal-500 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
                placeholder="Enter your education level"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
                placeholder="Enter your address"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
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
    <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
      <div className="h-8 bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
      
      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-gray-700 rounded-lg p-4 border border-gray-600 animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="w-2/3">
                <div className="h-5 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </div>
              <div className="h-6 w-10 bg-gray-600 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1 h-9 bg-gray-600 rounded-md"></div>
              <div className="flex-1 h-9 bg-gray-600 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <th key={item} scope="col" className="px-6 py-3">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6].map((cell) => (
                  <td key={cell} className="px-6 py-4">
                    <div className="h-4 bg-gray-600 rounded w-4/5"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="bg-gray-700 px-6 py-4 flex items-center justify-between border-t border-gray-600 mt-4 animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-gray-600 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-600 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-600 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Test History</h2>

        {testHistory.testAttempts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-gray-700 rounded-lg border border-gray-600">
            <div className="mx-auto w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No test history yet</h3>
            <p className="text-gray-400 mb-4">Take your first test to see your history here.</p>
            <button 
              onClick={() => navigate('/exams')}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors"
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
                  <div key={test._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{test.examId.name}</h3>
                        <p className="text-sm text-gray-300">{test.testId.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.score >= 80 ? "bg-green-900 text-green-300" :
                        test.score >= 60 ? "bg-yellow-900 text-yellow-300" :
                        "bg-red-900 text-red-300"
                      }`}>
                        {test.score}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">Date</p>
                        <p className="font-medium text-white">{formattedDate}</p>
                        <p className="text-gray-300">{formattedTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="font-medium text-white">{formattedDuration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Accuracy</p>
                        <p className="font-medium text-white">{test.accuracy}%</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(test)}
                        className="flex-1 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-500 transition-colors"
                      >
                        View Results
                      </button>
                      <button
                        onClick={() => handleRetake(test)}
                        className="flex-1 py-2 bg-gray-600 border border-gray-500 text-gray-200 text-sm font-medium rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Exam/Test
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
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
                      <tr key={test._id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{test.examId.name}</div>
                          <div className="text-sm text-gray-300">{test.testId.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{test.testId.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2 w-12 rounded-full mr-2 ${
                              test.score >= 80 ? "bg-green-900" :
                              test.score >= 60 ? "bg-yellow-900" :
                              "bg-red-900"
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
                              test.score >= 80 ? "text-green-400" :
                              test.score >= 60 ? "text-yellow-400" :
                              "text-red-400"
                            }`}>
                              {test.score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formattedDuration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-white">
                            {test.accuracy}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(test)}
                              className="px-3 py-1 bg-teal-700 text-teal-200 rounded-md hover:bg-teal-600 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleRetake(test)}
                              className="px-3 py-1 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
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
        <div className="bg-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between border-t border-gray-600">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === testHistory.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{(currentPage - 1) * 10 + 1}</span> to{" "}
                <span className="font-medium text-white">{Math.min(currentPage * 10, testHistory.totalTests)}</span> of{" "}
                <span className="font-medium text-white">{testHistory.totalTests}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? 'z-10 bg-teal-800 border-teal-600 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-750'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === testHistory.totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed"
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


// const Performance = () => {
//   const { userData } = useOutletContext();
//   const [performanceData, setPerformanceData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPerformanceData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/performance`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setPerformanceData(data);
//         } else {
//           console.error("Failed to fetch performance data");
//         }
//       } catch (error) {
//         console.error("Error fetching performance data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPerformanceData();
//   }, []);

//   console.log("Performance Data:", performanceData);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[1, 2, 3, 4].map((item) => (
//             <div key={item} className="bg-white rounded-xl shadow-sm p-6">
//               <div className="animate-pulse">
//                 <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
//                 <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
//                 <div className="h-2 bg-gray-300 rounded"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Overall Stats */}
//         {/* <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="text-gray-500 mb-1">Overall Percentile</h3>
//           <div className="flex items-end">
//             <p className="text-3xl font-bold text-gray-800">
//               {performanceData?.overall?.percentile || 0}
//             </p>
//             <span className="text-lg text-gray-500 ml-1">/100</span>
//           </div>
//           <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-primary-500"
//               style={{ width: `${performanceData?.overall?.percentile || 0}%` }}
//             ></div>
//           </div>
//         </div> */}

//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="text-gray-500 mb-1">Accuracy</h3>
//           <div className="flex items-end">
//             <p className="text-3xl font-bold text-gray-800">
//               {performanceData?.overall?.accuracy || 0}%
//             </p>
//           </div>
//           <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-green-500"
//               style={{ width: `${performanceData?.overall?.accuracy || 0}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="text-gray-500 mb-1">Speed</h3>
//           <div className="flex items-end">
//             <p className="text-3xl font-bold text-gray-800">
//               {performanceData?.overall?.speed || 0}%
//             </p>
//           </div>
//           <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-yellow-500"
//               style={{ width: `${performanceData?.overall?.speed || 0}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="text-gray-500 mb-1">All India Rank</h3>
//           <p className="text-3xl font-bold text-gray-800">
//             #{performanceData?.overall?.rank || "N/A"}
//           </p>
//           <p className="text-sm text-gray-500 mt-2">Top {performanceData?.overall?.percentile || 0}% of test takers</p>
//         </div>
//       </div>

//       {/* Subject-wise Performance */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Subject-wise Performance
//         </h2>
//         <div className="space-y-6">
//           {performanceData?.subjects?.length > 0 ? (
//             performanceData.subjects.map((subject, index) => (
//               <div key={index}>
//                 <div className="flex justify-between mb-2">
//                   <h3 className="font-medium text-gray-800">{subject.name}</h3>
//                   <span className="text-gray-600">
//                     {subject.score}% (Top {subject.percentile}%)
//                   </span>
//                 </div>
//                 <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-primary-500"
//                     style={{ width: `${subject.score}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No subject data available</p>
//           )}
//         </div>
//       </div>

//       {/* Improvement Graph */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Your Improvement
//         </h2>
//         {performanceData?.improvement?.length > 0 ? (
//           <div className="flex items-end h-64 space-x-2">
//             {performanceData.improvement.map((data, index) => (
//               <div key={index} className="flex-1 flex flex-col items-center">
//                 <div
//                   className="w-full bg-primary-500 rounded-t-sm"
//                   style={{ height: `${(data.score / 100) * 200}px` }}
//                 ></div>
//                 <span className="text-xs text-gray-500 mt-2">{data.month}</span>
//                 <span className="text-xs font-medium">{data.score}%</span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No improvement data available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// Saved Tests Component


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
          <div key={item} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-2 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item}>
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/5"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex items-end h-48 space-x-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-700 rounded-t-sm h-32"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mt-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3 mt-1"></div>
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
      <div className="bg-gray-800 rounded-xl p-6 border border-red-500">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Performance Data</h3>
          <p className="text-gray-400">{error}</p>
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
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <div className="text-gray-500 text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Performance Data Available</h3>
          <p className="text-gray-400">Take some tests to see your performance metrics here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
        <p className="text-gray-400">Track your progress and improve your skills</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-teal-900/20 p-2 rounded-lg mr-3">
              <span className="text-teal-500">📝</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Tests Taken</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {performanceData.overall.testsTaken || 0}
          </p>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${Math.min((performanceData.overall.testsTaken || 0) * 10, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-green-900/20 p-2 rounded-lg mr-3">
              <span className="text-green-500">🎯</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Average Score</h3>
          </div>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-white mb-2">
              {parseFloat(performanceData.overall.avgScore || 0).toFixed(1)}%
            </p>
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${performanceData.overall.avgScore || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-blue-900/20 p-2 rounded-lg mr-3">
              <span className="text-blue-500">✓</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Accuracy</h3>
          </div>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-white mb-2">
              {parseFloat(performanceData.overall.accuracy || 0).toFixed(1)}%
            </p>
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${performanceData.overall.accuracy || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors">
          <div className="flex items-center mb-4">
            <div className="bg-purple-900/20 p-2 rounded-lg mr-3">
              <span className="text-purple-500">🏆</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">All India Rank</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            #{calculateRank()}
          </p>
          <p className="text-sm text-gray-500">
            Top {Math.round(100 - parseFloat(performanceData.overall.avgScore || 0))}% of test takers
          </p>
        </div>
      </div>

      {/* Questions Summary */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <span className="mr-2">📋</span> Questions Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-6 bg-gray-750 rounded-lg border border-gray-700">
            <div className="text-4xl font-bold text-white">{performanceData.overall.totalQuestions || 0}</div>
            <div className="text-gray-400 text-sm mt-2">Total Questions</div>
          </div>
          <div className="text-center p-6 bg-green-900/20 rounded-lg border border-green-800/30">
            <div className="text-4xl font-bold text-green-400">{performanceData.overall.correctAnswers || 0}</div>
            <div className="text-green-400 text-sm mt-2">Correct Answers</div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData.overall.totalQuestions ? 
                Math.round((performanceData.overall.correctAnswers / performanceData.overall.totalQuestions) * 100) : 0
              }% of total
            </div>
          </div>
          <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-800/30">
            <div className="text-4xl font-bold text-red-400">{performanceData.overall.incorrectAnswers || 0}</div>
            <div className="text-red-400 text-sm mt-2">Incorrect Answers</div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData.overall.totalQuestions ? 
                Math.round((performanceData.overall.incorrectAnswers / performanceData.overall.totalQuestions) * 100) : 0
              }% of total
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <span className="mr-2">📚</span> Subject-wise Performance
        </h2>
        <div className="space-y-6">
          {performanceData.subjects && performanceData.subjects.length > 0 ? (
            performanceData.subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium text-white">{subject.subject}</h3>
                    <p className="text-sm text-gray-400">
                      {subject.correct || 0}/{subject.total || 0} correct • {subject.attempts || 0} attempts
                    </p>
                  </div>
                  <span className={`text-lg font-semibold ${
                    parseFloat(subject.percentage) >= 70 ? 'text-green-400' : 
                    parseFloat(subject.percentage) >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {parseFloat(subject.percentage || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
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
            <p className="text-gray-500 text-center py-8">No subject data available</p>
          )}
        </div>
      </div>

     
      {/* Recommendations */}
      {performanceData.overall.avgScore < 70 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">💡</span> Improvement Tips
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
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
      <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">
          Saved Tests
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
              <div className="animate-pulse">
                <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-red-500">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Saved Tests</h3>
          <p className="text-gray-400">{error}</p>
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
    <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <span className="mr-2">📁</span> Saved Tests
        </h2>

        {savedTests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl text-gray-500 mb-4">📑</div>
            <h3 className="text-lg font-medium text-white mb-2">
              No saved tests yet
            </h3>
            <p className="text-gray-400">
              Save tests to access them later from here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedTests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:border-teal-500 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-medium text-white">{test.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-800/50">
                        {test.category}
                      </span>
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded border border-green-800/50">
                        {test.questions} Questions
                      </span>
                      <span className="bg-purple-900/30 text-purple-400 text-xs px-2 py-1 rounded border border-purple-800/50">
                        {test.duration}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          test.difficulty === "Easy"
                            ? "bg-green-900/30 text-green-400 border-green-800/50"
                            : test.difficulty === "Moderate"
                            ? "bg-yellow-900/30 text-yellow-400 border-yellow-800/50"
                            : "bg-red-900/30 text-red-400 border-red-800/50"
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
                      className="border border-gray-600 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <span className="mr-1">🗑️</span> Remove
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400">
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
      <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Help Center</h2>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-gray-700 rounded mb-6"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-red-500">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Help Center</h3>
          <p className="text-gray-400">{error}</p>
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
    <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <span className="mr-2">❓</span> Help Center
      </h2>

      <div className="space-y-6">
        <div className="bg-teal-900/20 border border-teal-700/30 rounded-lg p-5">
          <h3 className="font-medium text-teal-300 mb-2 flex items-center">
            <span className="mr-2">💬</span> Need immediate assistance?
          </h3>
          <p className="text-sm text-teal-200 mb-4">
            Our support team is available 24/7 to help you with any issues.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
            <span className="mr-2">📧</span> Contact Support
          </button>
        </div>

        <div>
          <h3 className="font-medium text-white mb-4 flex items-center">
            <span className="mr-2">📋</span> Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:border-teal-500 transition-colors"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-750 transition-colors"
                  onClick={() =>
                    setActiveFaq(activeFaq === faq.id ? null : faq.id)
                  }
                >
                  <span className="font-medium text-white text-left">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
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
                  <div className="p-4 pt-0 text-gray-300 bg-gray-750 border-t border-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Resources */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="font-medium text-white mb-4 flex items-center">
            <span className="mr-2">🔍</span> Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 hover:border-teal-500 transition-colors">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <span className="mr-2">📖</span> User Guides
              </h4>
              <p className="text-sm text-gray-400">
                Comprehensive guides to help you make the most of our platform.
              </p>
            </div>
            <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 hover:border-teal-500 transition-colors">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <span className="mr-2">🎥</span> Video Tutorials
              </h4>
              <p className="text-sm text-gray-400">
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
