/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import toast from 'react-hot-toast';

/**
 * Show success notification
 * @param {string} message - Success message to display
 */
export const showSuccess = (message) => {
    toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#1a1a2e',
            color: '#00ff88',
            border: '1px solid #00ff88',
            borderRadius: '8px',
            padding: '16px',
        },
        iconTheme: {
            primary: '#00ff88',
            secondary: '#1a1a2e',
        },
    });
};

/**
 * Show error notification
 * @param {string} message - Error message to display
 */
export const showError = (message) => {
    toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
            background: '#1a1a2e',
            color: '#ff0055',
            border: '1px solid #ff0055',
            borderRadius: '8px',
            padding: '16px',
        },
        iconTheme: {
            primary: '#ff0055',
            secondary: '#1a1a2e',
        },
    });
};

/**
 * Show info notification
 * @param {string} message - Info message to display
 */
export const showInfo = (message) => {
    toast(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#1a1a2e',
            color: '#00aaff',
            border: '1px solid #00aaff',
            borderRadius: '8px',
            padding: '16px',
        },
        icon: 'ℹ️',
    });
};

/**
 * Show loading notification
 * @param {string} message - Loading message to display
 * @returns {string} Toast ID for dismissing later
 */
export const showLoading = (message) => {
    return toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#1a1a2e',
            color: '#ffffff',
            border: '1px solid #666',
            borderRadius: '8px',
            padding: '16px',
        },
    });
};

/**
 * Dismiss a specific toast
 * @param {string} toastId - ID of toast to dismiss
 */
export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};
