import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExamTestSeriesPage from './pages/ExamTestSeriesPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import TestSeriesDetailPage from './pages/TestSeriesDetailPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
       <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/exam-test-series" element={<ExamTestSeriesPage />} />
        
        {/* Protected routes */}
        {/* <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
        </Route>
         */}
        <Route path="/" element={<HomePage />} />
        <Route path="/exam-details/:examId" element={<TestSeriesDetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
