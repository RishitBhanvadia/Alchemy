import PropTypes from 'prop-types';

import React from 'react';
import './SkeletonLoader.css';

const SkeletonItem = ({ className = '', style = {} }) => (
    <div className={`skeleton-item ${className || ''}`} style={style}></div>
);

export const LabSkeleton = () => (
    <div className="skeleton-container lab-skeleton">
        <SkeletonItem className="skeleton-header" />
        <SkeletonItem className="skeleton-canvas" />
        <div className="skeleton-controls">
            <SkeletonItem className="skeleton-slider" />
            <SkeletonItem className="skeleton-slider" />
            <SkeletonItem className="skeleton-slider" />
            <SkeletonItem className="skeleton-slider" />
            <SkeletonItem className="skeleton-button" />
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="skeleton-container dashboard-skeleton">
        <SkeletonItem className="skeleton-header" />
        <SkeletonItem className="skeleton-toolbar" />
        <div className="skeleton-table">
            <SkeletonItem className="skeleton-row" />
            <SkeletonItem className="skeleton-row" />
            <SkeletonItem className="skeleton-row" />
            <SkeletonItem className="skeleton-row" />
            <SkeletonItem className="skeleton-row" />
        </div>
        <SkeletonItem className="skeleton-chart" />
    </div>
);

export const GenericSkeleton = () => (
    <div className="skeleton-container">
        <SkeletonItem style={{ height: '200px' }} />
        <SkeletonItem style={{ height: '400px' }} />
    </div>
);

GenericSkeleton.propTypes = { className: PropTypes.string, style: PropTypes.object };
SkeletonItem.propTypes = { className: PropTypes.string, style: PropTypes.object };
