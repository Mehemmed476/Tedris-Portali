import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import ParentDashboard from './pages/ParentDashboard.jsx';
import LinkAccountPage from './pages/LinkAccountPage.jsx';
import StudentLoginPage from './pages/StudentLoginPage.jsx'; // YENİ
import StudentDashboard from './pages/StudentDashboard.jsx'; // YENİ
import Toast from './components/Toast.jsx';
import { ICONS } from './components/Icon.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); 
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Əsas səhifəyə yönləndiririk
    window.location.href = '/';
  };
  
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">{ICONS.spinner}</div>;
  }

  // --- YENİ ROUTING MƏNTİQİ ---
  const { pathname } = window.location;

  // Əgər istifadəçi daxil olubsa
  if (user) {
    if (user.role === 'muellim') {
      return <TeacherDashboard user={user} onLogout={handleLogout} showToast={showToast} />;
    }
    if (user.role === 'valideyn') {
      if (user.linkedStudentId) { 
          return <ParentDashboard user={user} onLogout={handleLogout} />;
      }
      return <LinkAccountPage user={user} />;
    }
    if (user.role === 'student') {
        return <StudentDashboard user={user} onLogout={handleLogout} />;
    }
  }

  // Əgər istifadəçi daxil olmayıbsa
  if (pathname === '/student-login') {
    return <StudentLoginPage />;
  }

  return <LoginPage />;
};