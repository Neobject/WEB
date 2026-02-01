const express = require('express');
const router = express.Router();

const aiProvider = require('./services/providers');

// Chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const message = req.body.message?.trim() || 'Hello';
        const reply = await aiProvider.askAI(message);

        res.json({
            success: true,
            reply
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// Sentiment analysis endpoint
router.post('/analyze', async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const result = await aiProvider.getSentiment(text);
        const best = result[0].sort((a, b) => b.score - a.score)[0];

        res.json({
            success: true,
            sentiment: best.label,
            confidence: `${(best.score * 100).toFixed(2)}%`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Hugging Face API error'
        });
    }
});

module.exports = router;
