import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RoleSelection } from '../components/auth/RoleSelection';
import { AdminLoginForm } from '../components/auth/AdminLoginForm';
import { MemberLoginForm } from '../components/auth/MemberLoginForm';
import { OtherUserLoginForm } from '../components/auth/OtherUserLoginForm';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { loginWithRole, loginAsGuest } = useApp();
  const navigate = useNavigate();

  // Active view: null means showing the 3 large role selection cards
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'student' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotRoleName, setForgotRoleName] = useState<string | null>(null);

  const handleRoleLogin = async (
    role: 'admin' | 'member' | 'student',
    identifier: string,
    password?: string,
    remember: boolean = true
  ) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await loginWithRole(role, identifier, password, remember);
      if (result.success) {
        navigate(result.redirectPath);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const redirectPath = await loginAsGuest();
      navigate(redirectPath);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to start guest exploration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectStudentLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const result = await loginWithRole('student', 'student@prism.edu', 'Student@2026!', true);
      if (result.success) {
        navigate(result.redirectPath);
      } else {
        setErrorMessage(result.error || 'Direct entry failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Direct entry failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060713] text-slate-100 flex flex-col items-center justify-center relative overflow-hidden p-4 sm:p-6 md:p-10">
      {/* Background Ambience: OrbitX inspired cosmic glowing nebulae */}
      <div className="absolute top-1/4 -left-28 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-28 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Floating Constellation accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-purple-400 rounded-full top-[15%] left-[12%] animate-ping" />
        <div className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full top-[80%] left-[88%] animate-pulse" />
        <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full top-[25%] right-[15%] animate-ping" />
        <div className="absolute w-2 h-2 bg-pink-400 rounded-full bottom-[20%] left-[25%] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Brand Crest & Heading */}
        <div className="text-center mb-8 sm:mb-12">
          {/* PRISM Emblem Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[2px] shadow-2xl shadow-purple-500/30 mb-4 transform hover:scale-105 hover:rotate-3 transition-transform">
            <div className="w-full h-full bg-[#090b1c] rounded-[22px] flex items-center justify-center">
              <svg
                className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
            Welcome to PRISM
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-medium max-w-md mx-auto">
            Your campus. Your community. Your experience.
          </p>
        </div>

        {/* Dynamic View: Role Selection vs Individual Role Login Form */}
        {selectedRole === null ? (
          <RoleSelection
            onSelectRole={(role) => {
              if (role === 'student') {
                handleDirectStudentLogin();
                return;
              }
              setErrorMessage('');
              setSelectedRole(role);
            }}
            onDirectStudentAccess={handleDirectStudentLogin}
            onSelectGuest={handleGuestLogin}
            isGuestLoading={isLoading}
          />
        ) : selectedRole === 'admin' ? (
          <AdminLoginForm
            onLogin={(id, pwd, rem) => handleRoleLogin('admin', id, pwd, rem)}
            onBack={() => {
              setErrorMessage('');
              setSelectedRole(null);
            }}
            onForgotPassword={() => setForgotRoleName('Administrator')}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : selectedRole === 'member' ? (
          <MemberLoginForm
            onLogin={(id, pwd, rem) => handleRoleLogin('member', id, pwd, rem)}
            onBack={() => {
              setErrorMessage('');
              setSelectedRole(null);
            }}
            onForgotPassword={() => setForgotRoleName('PRISM Member')}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : (
          <OtherUserLoginForm
            onLogin={(id, pwd, rem) => handleRoleLogin('student', id, pwd, rem)}
            onGuestLogin={handleGuestLogin}
            onBack={() => {
              setErrorMessage('');
              setSelectedRole(null);
            }}
            onForgotPassword={() => setForgotRoleName('Student')}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={Boolean(forgotRoleName)}
        onClose={() => setForgotRoleName(null)}
        roleName={forgotRoleName || ''}
      />

      {/* Footer Branding */}
      <footer className="mt-12 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 PRISM Collegiate Innovation Platform • Secured with Quantum-Resistant Encryption</p>
      </footer>
    </div>
  );
};
