import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CampaignProvider } from './contexts/CampaignContext';
import LandingPage from './components/LandingPage';
import Discover from './components/Discover';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateCampaign from './components/campaigns/CreateCampaign';
import CampaignDetail from './components/campaigns/CampaignDetail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/content-rewards" element={<LandingPage />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/create-campaign" 
                element={
                  <ProtectedRoute requiredRole="brand" redirectTo="/login">
                    <CreateCampaign />
                  </ProtectedRoute>
                } 
              />
              <Route path="/campaign/:campaignId" element={<CampaignDetail />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </CampaignProvider>
    </AuthProvider>
  );
}

export default App;
