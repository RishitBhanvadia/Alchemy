import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a1a',
          color: '#00f3ff',
          fontFamily: "'Outfit', sans-serif",
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '0 0 10px rgba(0, 243, 255, 0.5)' }}>⚠️ REACTANT SPILL!</h1>
          <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', lineHeight: '1.6' }}>
            Something went wrong in the lab. Our safety protocols have contained the error.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              marginTop: '40px',
              padding: '15px 40px',
              background: 'rgba(0, 243, 255, 0.1)',
              border: '2px solid #00f3ff',
              color: '#00f3ff',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
                e.target.style.background = '#00f3ff';
                e.target.style.color = '#000';
                e.target.style.boxShadow = '0 0 20px #00f3ff';
            }}
            onMouseOut={(e) => {
                e.target.style.background = 'rgba(0, 243, 255, 0.1)';
                e.target.style.color = '#00f3ff';
                e.target.style.boxShadow = 'none';
            }}
          >
            RETURN TO SAFETY
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
