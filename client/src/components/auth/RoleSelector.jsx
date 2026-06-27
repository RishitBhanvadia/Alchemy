/* eslint-disable */
import React from 'react';
import { GraduationCap, FlaskConical, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelector = ({ selectedRole, setSelectedRole, error }) => {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Explore experiments and join classrooms.',
      icon: GraduationCap,
      color: 'ion-blue'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Manage labs and track student progress.',
      icon: FlaskConical,
      color: 'ion-purple'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = selectedRole === role.id;
        
        return (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole(role.id)}
            className={`cursor-pointer group relative p-4 rounded-2xl border transition-all duration-300 ${
              isActive 
              ? 'bg-white/10 border-ion-purple shadow-ion-glow' 
              : 'bg-white/5 border-white/5 hover:border-white/20'
            } ${error ? 'border-red-500/30' : ''}`}
          >
            {isActive && (
              <div className="absolute top-2 right-2 bg-ion-purple rounded-full p-0.5 shadow-lg z-10">
                <Check size={12} className="text-white" />
              </div>
            )}
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              isActive 
              ? 'bg-ion-gradient text-white' 
              : 'bg-white/5 text-on-surface/40 group-hover:text-on-surface/60'
            }`}>
              <Icon size={20} />
            </div>
            
            <h3 className={`text-sm font-display font-semibold mb-1 transition-colors ${isActive ? 'text-white' : 'text-on-surface/70'}`}>
              {role.title}
            </h3>
            <p className="text-[10px] text-on-surface/40 leading-tight">
              {role.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoleSelector;
