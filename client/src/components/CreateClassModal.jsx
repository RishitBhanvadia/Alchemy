/**
 * CreateClassModal.jsx — Modal to create a Zoom or Google Meet session
 *
 * Teacher clicks "Create Meeting" → this modal appears with two options.
 * On success, it shows the MeetingCodeCard with the generated code.
 *
 * Props:
 *   isOpen   - Boolean controlling visibility
 *   onClose  - Callback to close the modal
 */

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import MeetingCodeCard from './MeetingCodeCard';
import { createZoomMeeting, createGoogleMeeting, getGoogleAuthUrl } from '../utils/api';
import useAuthStore from '../store/authStore';

const CreateClassModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null); // { code, meetingUrl, platform }
  const profile = useAuthStore(state => state.profile);

  // Reset state when modal closes
  const handleClose = () => {
    setMeetingData(null);
    setLoading(false);
    onClose();
  };

  // ─── Zoom flow: direct API call ─────────────────────────────────────────────

  const handleZoom = async () => {
    setLoading(true);
    try {
      const response = await createZoomMeeting();
      setMeetingData(response.data);
      toast.success('Zoom meeting created!');
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err.message || 'Failed to create Zoom meeting';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Google flow: OAuth redirect → then create meeting ──────────────────────

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Check if the URL has google_auth=success (user just returned from OAuth)
      const urlParams = new URLSearchParams(window.location.search);
      const googleAuth = urlParams.get('google_auth');

      if (googleAuth === 'success') {
        // OAuth completed, create the meeting
        const response = await createGoogleMeeting();
        setMeetingData(response.data);
        toast.success('Google Meet created!');

        // Clean up URL params
        const url = new URL(window.location);
        url.searchParams.delete('google_auth');
        window.history.replaceState({}, '', url);
      } else {
        // Need to authenticate first — redirect to Google OAuth
        const authUrl = getGoogleAuthUrl(profile?.id);
        window.location.href = authUrl;
        return; // Page will navigate away
      }
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err.message || 'Failed to create Google Meet';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleClose} role="presentation">
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} role="presentation">
        {meetingData ? (
          /* ── Success: show code card ── */
          <MeetingCodeCard
            code={meetingData.code}
            meetingUrl={meetingData.meetingUrl}
            platform={meetingData.platform}
            onClose={handleClose}
          />
        ) : (
          /* ── Selection: choose platform ── */
          <>
            <button onClick={handleClose} style={styles.closeBtn} aria-label="Close">✕</button>
            <h2 style={styles.title}>Create a Meeting</h2>
            <p style={styles.subtitle}>Choose a platform to start a live class session</p>

            <div style={styles.optionGrid}>
              {/* Zoom option */}
              <button
                onClick={handleZoom}
                disabled={loading}
                style={styles.optionCard}
                className="meeting-option-card"
              >
                {loading ? (
                  <div style={styles.spinner} />
                ) : (
                  <>
                    <div style={styles.optionIcon}>📹</div>
                    <h3 style={styles.optionTitle}>Zoom Meeting</h3>
                    <p style={styles.optionDesc}>Create an instant Zoom meeting room</p>
                  </>
                )}
              </button>

              {/* Google Meet option */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                style={styles.optionCard}
                className="meeting-option-card"
              >
                {loading ? (
                  <div style={styles.spinner} />
                ) : (
                  <>
                    <div style={styles.optionIcon}>🎥</div>
                    <h3 style={styles.optionTitle}>Google Meet</h3>
                    <p style={styles.optionDesc}>Create via Google Calendar integration</p>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    position: 'relative',
    background: 'linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 30, 0.98))',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    padding: '2.5rem',
    maxWidth: '500px',
    width: '90vw',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    animation: 'slideUp 0.3s ease-out',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'color 0.2s',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#F9FAFB',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  optionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem 1rem',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.04)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    minHeight: '160px',
    color: '#fff',
  },
  optionIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
  },
  optionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
    color: '#F9FAFB',
  },
  optionDesc: {
    fontSize: '0.78rem',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(99, 102, 241, 0.2)',
    borderTop: '3px solid #6366F1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

import PropTypes from 'prop-types';

// Inject keyframe animations
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('create-class-modal-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'create-class-modal-styles';
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .meeting-option-card:hover {
        border-color: rgba(99, 102, 241, 0.5) !important;
        background: rgba(99, 102, 241, 0.1) !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
      }
      .meeting-option-card:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

CreateClassModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateClassModal;
