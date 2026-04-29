import React from 'react';
import PropTypes from 'prop-types';
import { User, GraduationCap } from 'lucide-react';

const RoleCard = ({ userRole, selected, onSelect }) => {
  const roleConfig = {
    student: {
      icon: User,
      title: 'Student',
      description: 'Join classes and perform virtual experiments'
    },
    teacher: {
      icon: GraduationCap,
      title: 'Teacher',
      description: 'Create classes and monitor student progress'
    }
  };

  const config = roleConfig[userRole];
  const Icon = config.icon;

  return (
    <div
      onClick={() => onSelect(userRole)}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
        selected
          ? 'border-lab-cyan bg-lab-cyan/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${
          selected ? 'bg-lab-cyan text-white' : 'bg-white/10 text-lab-muted'
        }`}>
          <Icon size={24} />
        </div>
        <div className="flex-1 text-left">
          <h3 className={`font-semibold ${selected ? 'text-white' : 'text-gray-300'}`}>
            {config.title}
          </h3>
          <p className="text-xs text-lab-muted mt-1 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
};

RoleCard.propTypes = {
  userRole: PropTypes.oneOf(['student', 'teacher']).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RoleCard;
