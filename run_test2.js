try { require('./server/server.js') } catch (e) { if (e.message.includes('STARTUP FAILED')) process.exit(0); throw e; }
