import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import InputField from './InputField';
import CTAButton from './CTAButton';
import RoleCard from './RoleCard';

const SignUpForm = ({ onTabSwitch }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleType: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full scientific name.';
    if (!formData.email) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    
    if (!formData.password) newErrors.password = 'Security key is required.';
    else if (formData.password.length < 8) newErrors.password = 'Auth key must be at least 8 characters.';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Secret keys do not match.';
    
    if (!formData.roleType) newErrors.roleType = 'Please choose your lab roleType.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRoleSelect = (roleType) => {
    setFormData(prev => ({ ...prev, roleType }));
    if (errors.roleType) setErrors(prev => ({ ...prev, roleType: '' }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName, roleType: formData.roleType }
        }
      });

      if (authError) throw authError;

      toast.success('Registration successful! Verify your email to begin.');
      onTabSwitch('login');
    } catch (err) {
      toast.error(err.message || 'Initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <InputField
        label="Full Name"
        name="fullName"
        icon={User}
        placeholder="Dr. Marie Curie"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        disabled={loading}
      />

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

      <div className="grid grid-cols-2 gap-4">
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
        <InputField
          label="Confirm"
          name="confirmPassword"
          type="password"
          icon={ShieldCheck}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
        />
      </div>

      <div className="pt-2 space-y-3">
        <h3 className="text-center text-[11px] font-medium text-lab-muted tracking-[0.15em] uppercase">
          Select Your Lab Role
        </h3>
        <div className="flex gap-3">
          <RoleCard 
            roleType="student"
            selected={formData.roleType === 'student'}
            onSelect={handleRoleSelect} 
          />
          <RoleCard 
            roleType="teacher"
            selected={formData.roleType === 'teacher'}
            onSelect={handleRoleSelect} 
          />
        </div>
        {errors.roleType && (
          <p className="text-center text-[10px] text-red-400 font-medium">{errors.roleType}</p>
        )}
      </div>

      <div className="pt-2">
        <CTAButton loading={loading} icon="UserPlus">
          Initialize Account
        </CTAButton>
      </div>
    </form>
  );
};

export default SignUpForm;
