/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import logger from '../utils/logger';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('Error boundary caught error', { error: error.message, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="glass-panel error-card">
                        <div className="error-icon">⚠️</div>
                        <h1 className="neon-glow">Something went wrong</h1>
                        <p className="error-message">
                            We&apos;ve encountered an unexpected error in the lab simulation.
                        </p>
                        <div className="error-actions">
                            <button
                                onClick={() => window.location.reload()}
                                className="action-button active"
                            >
                                RELOAD LAB
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="action-button"
                                style={{ background: 'rgba(255,255,255,0.1)' }}
                            >
                                TRY AGAIN
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <pre className="error-stack">
                                {this.state.error && this.state.error.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
