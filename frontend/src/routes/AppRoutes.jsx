import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

// Farmer Pages
import FarmerDashboard from '../pages/farmer/FarmerDashboard.jsx';
import SubmitPredictionPage from '../pages/farmer/SubmitPredictionPage.jsx';
import SubmitCropPage from '../pages/farmer/SubmitCropPage.jsx';
import SoilTestPage from '../pages/farmer/SoilTestPage.jsx';
import MyRequestsPage from '../pages/farmer/MyRequestsPage.jsx';
import ViewReportPage from "../pages/farmer/ViewReportPage";

// Officer Pages
import OfficerDashboard from '../pages/officer/OfficerDashboard.jsx';
import PendingRequestsPage from '../pages/officer/PendingRequestsPage.jsx';
import AssignedRequestsPage from '../pages/officer/AssignedRequestsPage.jsx';
import AIProcessingPage from '../pages/officer/AIProcessingPage.jsx';
import ReviewPage from '../pages/officer/ReviewPage.jsx';
import CompletePage from '../pages/officer/CompletePage.jsx';
import SchedulePage from '../pages/officer/SchedulePage.jsx';
import UploadReportPage from '../pages/officer/UploadReportPage.jsx';
import CompletedRequestsPage from '../pages/officer/CompletedRequestsPage.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard";
import ApproveOfficers from '../pages/admin/ApproveOfficers.jsx';
import SubmitReportPage from '../pages/officer/SubmitReportPage.jsx';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Farmer Routes */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute requiredRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/submit-prediction"
        element={
          <ProtectedRoute requiredRole="farmer">
            <SubmitPredictionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/submit-crop"
        element={
          <ProtectedRoute requiredRole="farmer">
            <SubmitCropPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/soil-test"
        element={
          <ProtectedRoute requiredRole="farmer">
            <SoilTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/my-requests"
        element={
          <ProtectedRoute requiredRole="farmer">
            <MyRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/view/:requestId"
        element={
          <ProtectedRoute requiredRole="farmer">
            <ViewReportPage />
          </ProtectedRoute>
        }
      />

      {/* Officer Routes */}
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute requiredRole="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/pending"
        element={
          <ProtectedRoute requiredRole="officer">
            <PendingRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/assigned"
        element={
          <ProtectedRoute requiredRole="officer">
            <AssignedRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/process/:requestId"
        element={
          <ProtectedRoute requiredRole="officer">
            <AIProcessingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/review/:requestId"
        element={
          <ProtectedRoute requiredRole="officer">
            <ReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/complete/:requestId"
        element={
          <ProtectedRoute requiredRole="officer">
            <CompletePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/schedule/:requestId"
        element={
          <ProtectedRoute requiredRole="officer">
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/upload/:requestId"
        element={
          <ProtectedRoute requiredRole="officer">
            <UploadReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/completed"
        element={
          <ProtectedRoute requiredRole="officer">
            <CompletedRequestsPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/officer/submit-report/:requestId"
        element={
          <ProtectedRoute requiredRole="officer">
            <SubmitReportPage />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approve-officers"
        element={
          <ProtectedRoute requiredRole="admin">
            <ApproveOfficers />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;
