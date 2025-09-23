import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Landing from './components/Landing'
import AdminDashboard from './components/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const { user, loading } = useAuth()

  // Debug: Log user state changes
  console.log('AppContent - User:', user, 'Loading:', loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={
        <ProtectedRoute requiredUserType="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student" element={
        <ProtectedRoute requiredUserType="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
    </Routes>
    <div className="border-t-2 justify-center content-center">
      
    </div>
      
   </> 
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
