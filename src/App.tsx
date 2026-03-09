import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AcceptInvite = () => {
  const { token } = useAuth();
  const [status, setStatus] = React.useState('Aceptando invitación...');
  
  React.useEffect(() => {
    const accept = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteToken = urlParams.get('token');
      
      if (!inviteToken) {
        setStatus('Token de invitación no encontrado.');
        return;
      }

      try {
        const res = await fetch('/api/libraries/accept-invite', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ token: inviteToken })
        });
        
        if (res.ok) {
          setStatus('Invitación aceptada. Redirigiendo...');
          setTimeout(() => window.location.href = '/', 2000);
        } else {
          const data = await res.json();
          setStatus(`Error: ${data.error}`);
        }
      } catch (err) {
        setStatus('Error de conexión');
      }
    };
    
    accept();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 text-center">
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8 max-w-md w-full">
        <p className="text-[#E4E3E0] font-mono uppercase text-xs">{status}</p>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/accept-invite" 
            element={
              <ProtectedRoute>
                <AcceptInvite />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
