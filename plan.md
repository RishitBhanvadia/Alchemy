1. **Change `server.js`**
   - Wrap the `app.listen()` block inside `if (require.main === module) { ... }` and export the app (`module.exports = app;`) as per `AGENTS.md` instructions.
