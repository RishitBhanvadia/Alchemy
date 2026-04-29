import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="glass-panel confirm-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            padding: '24px', maxWidth: '400px', width: '90%',
                            textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px 0', color: '#F9FAFB', fontSize: '1.25rem' }}>{title}</h3>
                        <p style={{ color: '#9CA3AF', margin: '0 0 24px 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {message}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={onCancel}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.1)', color: 'white',
                                    border: 'none', cursor: 'pointer', fontWeight: '600'
                                }}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    background: isDestructive ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                    color: isDestructive ? '#EF4444' : 'white',
                                    border: isDestructive ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                                    cursor: 'pointer', fontWeight: '600'
                                }}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    isDestructive: PropTypes.bool
};

export default ConfirmModal;
