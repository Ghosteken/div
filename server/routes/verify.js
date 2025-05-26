const express = require('express');
const router = express.Router();
const { analyzeCertificate } = require('../services/aiService');

// Existing verification endpoint
router.get('/:code', async (req, res) => {
  // ... existing verification logic ...
});

// AI Analysis endpoint
router.post('/ai-analysis', async (req, res) => {
  try {
    const { certificateData } = req.body;

    if (!certificateData) {
      return res.status(400).json({ 
        error: 'Certificate data is required for analysis' 
      });
    }

    // Perform AI analysis
    const analysis = await analyzeCertificate(certificateData);
    
    res.json(analysis);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to perform AI analysis' 
    });
  }
});

module.exports = router; 