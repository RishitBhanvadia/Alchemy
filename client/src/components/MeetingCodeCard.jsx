import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Copy, ExternalLink, Check, Video, MonitorPlay } from 'lucide-react';
import toast from 'react-hot-toast';

const styles = {
  card: {
    background: 'linear-gradient(145deg, rgba(30,30,40,0.95), rgba(20,20,30,0.95))',
    border: '1px solid rgba(124, 58, 237, 0.3)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  glow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 60%)',
    pointerEvents: 'none'
  },
  codeContainer: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '16px',
    margin: '24px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    color: '#a78bfa',
    margin: 0
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px'
  },
  btn: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none'
  },
  primaryBtn: {
    background: '#7c3aed',
    color: 'white',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
  }
};

const MeetingCodeCard = ({ code, meetingUrl, platform, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    window.open(meetingUrl, '_blank');
  };

  return (
    <div style={styles.card}>
      <div style={styles.glow} />

      <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(124,58,237,0.2)', marginBottom: '16px' }}>
        {platform === 'zoom' ? <Video size={32} color="#a78bfa" /> : <MonitorPlay size={32} color="#a78bfa" />}
      </div>

      <h2 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '24px' }}>Class Created!</h2>
      <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
        Share this code with your students so they can join.
      </p>

      <div style={styles.codeContainer}>
        <h3 style={styles.codeText}>
          {code.split('').map((char, i) => (
            <span key={i} style={{ display: 'inline-block', minWidth: '24px' }}>{char}</span>
          ))}
        </h3>
        <button
          onClick={handleCopy}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Copy Code"
        >
          {copied ? <Check color="#10b981" size={24} /> : <Copy color="#a78bfa" size={24} />}
        </button>
      </div>

      <div style={styles.btnGroup}>
        <button style={{...styles.btn, ...styles.secondaryBtn}} onClick={onClose}>
          Done
        </button>
        <button style={{...styles.btn, ...styles.primaryBtn}} onClick={handleJoin}>
          Start Meeting <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

MeetingCodeCard.propTypes = {
  code: PropTypes.string.isRequired,
  meetingUrl: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MeetingCodeCard;
