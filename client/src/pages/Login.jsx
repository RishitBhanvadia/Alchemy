import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import './login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="login-container">
      {/* Background blobs */}
      <div className="bg-blob blob-1" aria-hidden="true"></div>
      <div className="bg-blob blob-2" aria-hidden="true"></div>

      <motion.div 
        className="auth-card"
        data-testid="auth-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        role="main"
        aria-label="Authentication form"
      >
        <div className="logo-section">
          <h1 className="logo-text">
            <span aria-hidden="true">⚗️</span> Alchemistry
          </h1>
          <p className="logo-tagline">The Virtual Chemistry Lab</p>
        </div>

        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            data-testid="login-tab"
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button 
            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.div
              key="login"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              <SignUpForm onTabSwitch={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="footer-text">
          By signing up you agree to our <a href="/terms" className="footer-link">Terms of Service</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

