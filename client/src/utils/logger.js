/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import log from 'loglevel';

// Configure log level based on environment
if (import.meta.env.PROD) {
    log.setLevel('error');
} else {
    log.setLevel('debug');
}

// Add custom formatting
const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    return function (message, ...args) {
        const timestamp = new Date().toISOString();
        rawMethod(`[${timestamp}] [${methodName.toUpperCase()}]`, message, ...args);
    };
};

log.setLevel(log.getLevel()); // Apply the custom method factory

export default log;
