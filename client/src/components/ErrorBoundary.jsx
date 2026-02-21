import React from 'react';
import PropTypes from 'prop-types';
import logger from '../utils/logger';

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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        background: '#0a0a0a',
                        color: '#ff0055',
                        padding: '20px',
                        textAlign: 'center',
                    }}
                >
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        ⚠️ Something went wrong
                    </h1>
                    <p style={{ marginBottom: '2rem', color: '#999' }}>
                        We apologize for the inconvenience. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            background: '#00ff88',
                            color: '#0a0a0a',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Reload Page
                    </button>
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
