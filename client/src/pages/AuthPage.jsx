import React, { useState } from 'react';
import AuthPageWrapper from '../components/auth/AuthPage';
import AuthCard from '../components/auth/AuthCard';
import TabSwitcher from '../components/auth/TabSwitcher';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <AuthPageWrapper>
      <AuthCard>
        <TabSwitcher 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {activeTab === 'login' ? (
          <LoginForm />
        ) : (
          <SignUpForm onTabSwitch={setActiveTab} />
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] text-lab-muted leading-relaxed font-medium">
            By joining the lab, you agree to our{' '}
            <button type="button" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-[11px] font-medium font-inherit">Terms of Service</button>
            {' '}and{' '}
            <button type="button" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-[11px] font-medium font-inherit">Privacy Policy</button>
          </p>
        </div>
      </AuthCard>
    </AuthPageWrapper>
  );
};

export default AuthPage;
