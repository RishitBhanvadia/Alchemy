/**
 * reactions.js — API routes for the reaction engine
 * Phase 3.3.2: POST /api/reactions, GET /api/chemicals
 */
const express = require('express');
const router = express.Router();

// TODO [Task 39-41]: Wire up algorithmic reaction engine
// POST /api/reactions - Process a reaction between two chemicals
router.post('/', (req, res) => {
  // Placeholder — will be implemented with chemicalMatrix-driven logic
  res.status(501).json({ error: 'Not implemented yet' });
});

// TODO [Task 42]: Dynamic chemical shelf endpoint
// GET /api/chemicals - Return all chemicals from chemicalMatrix.json
router.get('/chemicals', (req, res) => {
  // Placeholder — will return chemicals from chemicalMatrix.json
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
