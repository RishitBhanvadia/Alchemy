/**
 * MeetingCodeCard.jsx — Displays a meeting code with copy + start actions
 *
 * Props:
 *   code       - 6-character meeting code
 *   meetingUrl - URL to launch the meeting
 *   platform   - 'zoom' or 'google'
 *   onClose    - Callback to dismiss the card
 */

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const MeetingCodeCard = ({ code, meetingUrl, platform, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Meeting code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleStartMeeting = () => {
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
  };

  const platformLabel = platform === 'zoom' ? 'Zoom Meeting' : 'Google Meet';
  const platformIcon = platform === 'zoom' ? '📹' : '🎥';
  const platformColor = platform === 'zoom' ? '#2D8CFF' : '#00A663';

  return (
    <div style={styles.card}>
      {/* Close button */}
      <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>

      {/* Platform badge */}
      <div style={{ ...styles.platformBadge, background: `${platformColor}22`, borderColor: platformColor }}>
        <span>{platformIcon}</span>
        <span style={{ color: platformColor, fontWeight: 600 }}>{platformLabel}</span>
      </div>

      <p style={styles.subtitle}>Share this code with your students</p>

      {/* Large code display */}
      <div style={styles.codeDisplay} data-testid="join-code-value">
        {code.split('').map((char, i) => (
          <span key={i} style={styles.codeChar}>{char}</span>
        ))}
      </div>

      {/* Action buttons */}
      <div style={styles.actions}>
        <button onClick={handleCopy} style={styles.copyBtn}>
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
        <button onClick={handleStartMeeting} style={{ ...styles.startBtn, background: platformColor }}>
          🚀 Start Meeting
        </button>
      </div>

      <p style={styles.expiryNote}>This code expires in 2 hours</p>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    background: 'rgba(26, 26, 46, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    backdropFilter: 'blur(20px)',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.2s',
  },
  platformBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: '0.9rem',
    marginBottom: '1.2rem',
  },
  codeDisplay: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  codeChar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '56px',
    fontSize: '1.8rem',
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: '#fff',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '2px solid rgba(99, 102, 241, 0.4)',
    borderRadius: '10px',
    letterSpacing: '0',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  copyBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  startBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  expiryNote: {
    color: '#6B7280',
    fontSize: '0.75rem',
    marginTop: '1rem',
  },
};

export default MeetingCodeCard;

import PropTypes from 'prop-types';
MeetingCodeCard.propTypes = {
  code: PropTypes.string.isRequired,
  meetingUrl: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
