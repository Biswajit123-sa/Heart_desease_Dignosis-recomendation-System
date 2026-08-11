import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDataCollection from './pages/UserDataCollection';
import Prediction from './pages/Prediction';
import ChatAssistant from './pages/ChatAssistant';

import AgentPredictionView from './pages/AgentPredictionView';
import AgentRiskAnalysisView from './pages/AgentRiskAnalysisView';
import AgentRagView from './pages/AgentRagView';
import AgentRecommendationView from './pages/AgentRecommendationView';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#fef2f2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/data-collection" element={<PrivateRoute><UserDataCollection /></PrivateRoute>} />
            <Route path="/prediction" element={<PrivateRoute><Prediction /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><ChatAssistant /></PrivateRoute>} />

            {/* Agent Internal Routes */}
            <Route path="/agent/prediction/:id" element={<PrivateRoute><AgentPredictionView /></PrivateRoute>} />
            <Route path="/agent/risk/:id" element={<PrivateRoute><AgentRiskAnalysisView /></PrivateRoute>} />
            <Route path="/agent/rag/:id" element={<PrivateRoute><AgentRagView /></PrivateRoute>} />
            <Route path="/agent/recommendation/:id" element={<PrivateRoute><AgentRecommendationView /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;