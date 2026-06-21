/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * JoinMeetingPanel.jsx — Student panel to join a meeting by 6-char code
 *
 * Students enter a meeting code → app looks it up via API → shows Join button.
 */

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { joinMeetingByCode } from '../../utils/api';

const JoinMeetingPanel = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null); // { meetingUrl, platform }

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length !== 6) {
      return toast.error('Please enter a 6-character meeting code.');
    }

    setLoading(true);
    setMeetingInfo(null);

    try {
      const response = await joinMeetingByCode(code.trim());
      setMeetingInfo(response.data);
    } catch (err) {
      const msg = err?.response?.data?.error?.message
        || 'Invalid or expired code. Ask your teacher for a new one.';
      toast.error(msg);
      setMeetingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = () => {
    if (meetingInfo?.meetingUrl) {
      window.open(meetingInfo.meetingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const platformLabel = meetingInfo?.platform === 'zoom' ? 'Zoom Meeting' : 'Google Meet';
  const platformIcon = meetingInfo?.platform === 'zoom' ? '📹' : '🎥';
  const platformColor = meetingInfo?.platform === 'zoom' ? '#2D8CFF' : '#00A663';

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={styles.container}
    >
      <h3 style={styles.title}>🎓 Join Class Meeting</h3>

      {!meetingInfo ? (
        /* ── Code input form ── */
        <form onSubmit={handleLookup} style={styles.form}>
          <input
            type="text"
            placeholder="ENTER 6-CHAR CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            className="glass-input"
            maxLength={6}
            data-testid="meeting-code-input"
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading || code.trim().length !== 6}
            data-testid="lookup-meeting-btn"
            style={{
              ...styles.joinBtn,
              opacity: (loading || code.trim().length !== 6) ? 0.5 : 1,
            }}
          >
            {loading ? (
              <span style={styles.spinnerInline} />
            ) : (
              'Join'
            )}
          </button>
        </form>
      ) : (
        /* ── Meeting found: show join button ── */
        <div style={styles.meetingFound}>
          <div style={{ ...styles.platformBadge, borderColor: platformColor }}>
            <span>{platformIcon}</span>
            <span style={{ color: platformColor, fontWeight: 600 }}>{platformLabel}</span>
          </div>

          <p style={styles.readyText}>Your class is ready!</p>

          <button
            onClick={handleJoinMeeting}
            data-testid="join-meeting-btn"
            style={{ ...styles.bigJoinBtn, background: platformColor }}
          >
            🚀 Join Meeting
          </button>

          <button
            onClick={() => { setMeetingInfo(null); setCode(''); }}
            style={styles.backBtn}
          >
            ← Enter a different code
          </button>
        </div>
      )}
    </motion.div>
  );
};

const styles = {
  container: {
    padding: '1.2rem',
    borderRadius: '14px',
    background: 'rgba(26, 26, 46, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#F9FAFB',
    marginBottom: '12px',
  },
  form: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    fontWeight: 700,
    fontSize: '1rem',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    outline: 'none',
  },
  joinBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerInline: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  meetingFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  platformBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 16px',
    borderRadius: '20px',
    border: '1px solid',
    background: 'rgba(255,255,255,0.04)',
    fontSize: '0.85rem',
  },
  readyText: {
    color: '#D1D5DB',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  bigJoinBtn: {
    padding: '14px 36px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.05rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    width: '100%',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
};

export default JoinMeetingPanel;
