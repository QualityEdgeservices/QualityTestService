import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExamTestSeriesPage from './pages/ExamTestSeriesPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import TestSeriesDetailPage from './pages/TestSeriesDetailPage';
import MockTestInterface from './pages/MockTestInterface';
import TestResultsPage from './pages/TestResultsPage';
import UserDashboard, {
  Profile,
  TestHistory,
  Performance,
  SavedTests,
  UpcomingTests,
  Achievements,
  HelpCenter,
  Settings
}  from './pages/UserDashboard'
import { ChatProvider } from './contexts/ChatContext.jsx';
function AppContent() {
  const location = useLocation();

  const hideNavbarFooter = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/exam-test-series" element={<ExamTestSeriesPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/exam-details/:examId" element={<TestSeriesDetailPage />} />
        <Route path="/mock-test/:examId/:testId" element={<MockTestInterface />} />
        <Route path="/test-results/:examId/:testId" element={<TestResultsPage />} />

        <Route path="/dashboard" element={<UserDashboard />}>
          {/* <Route index element={<UserDashboard />} /> */}
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<TestHistory />} />
          <Route path="performance" element={<Performance />} />
          <Route path="saved" element={<SavedTests />} />
          <Route path="upcoming" element={<UpcomingTests />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <ChatProvider>
      <Router>
        <AppContent />
      </Router>
    </ChatProvider>
  );
}

export default App;
