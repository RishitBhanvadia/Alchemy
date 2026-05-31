import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import InputField from './InputField';
import CTAButton from './CTAButton';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    
    if (!formData.password) newErrors.password = 'Security key is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) {
         if (error.message.includes('Invalid login')) throw new Error('Lab credentials unauthorized.');
         throw error;
      }
      
      toast.success('Lab access granted. Welcome scientist!');
    } catch (err) {
      toast.error(err.message || 'Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <InputField
        label="Email Address"
        name="email"
        type="email"
        icon={Mail}
        placeholder="scientist@alchemistry.edu"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={loading}
      />

      <div>
        <InputField
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />
        <div className="flex justify-end mt-2">
          <button type="button" className="text-[12px] font-medium text-[#6366f1] hover:text-[#818cf8] uppercase tracking-[0.05em] transition-colors duration-150 unhover:no-underline hover:underline cursor-pointer">
            Forgot password?
          </button>
        </div>
      </div>

      <CTAButton loading={loading}>
        Access Lab
      </CTAButton>
    </form>
  );
};

export default LoginForm;
