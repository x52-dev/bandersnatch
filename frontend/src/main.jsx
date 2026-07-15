import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import InteractiveEditor from './pages/admin/InteractiveEditor.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// 1. Import the real Learner Portal we created
import LearnerPortal from './pages/learner/Portal.jsx'; 
import WatchRoom from './pages/learner/WatchRoom.jsx'; // 2. Import the WatchRoom component
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/editor/:id" element={<ProtectedRoute allowedRole="ADMIN"><InteractiveEditor /></ProtectedRoute>} />
        
        {/* Learner Routes */}
        <Route path="/learner/*" element={<ProtectedRoute allowedRole="LEARNER"><LearnerPortal /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />

     
<Route path="/learner" element={<ProtectedRoute allowedRole="LEARNER"><LearnerPortal /></ProtectedRoute>} />
<Route path="/learner/watch/:id" element={<ProtectedRoute allowedRole="LEARNER"><WatchRoom /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);