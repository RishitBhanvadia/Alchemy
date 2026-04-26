/* eslint-disable react/prop-types */
import React from 'react';
import './SkeletonBlock.css';

const SkeletonBlock = ({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) => {
  return (
    <div 
      className={`skeleton-block ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock 
          key={i} 
          width={i === lines - 1 ? '60%' : '100%'} 
          height="16px" 
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`skeleton-card ${className}`}>
      <SkeletonBlock width="60%" height="24px" />
      <SkeletonBlock width="80%" height="16px" />
      <SkeletonBlock width="40%" height="16px" />
    </div>
  );
};

export const SkeletonTableRow = ({ columns = 4, className = '' }) => {
  return (
    <div className={`skeleton-table-row ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonBlock key={i} width="100%" height="20px" />
      ))}
    </div>
  );
};

export default SkeletonBlock;
