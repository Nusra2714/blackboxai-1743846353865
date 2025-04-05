const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000']
}));
app.use(express.json());

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock API endpoint for image generation
app.post('/api/generate', async (req, res) => {
    try {
        const { text, genre, style, isStoryMode } = req.body;
        
        // Validate input
        if (!text) {
            return res.status(400).json({ error: 'Text input is required' });
        }

        // Split text into sentences if story mode is enabled
        const sentences = isStoryMode ? 
            text.split(/(?<=[।.!?])\s+/) : 
            [text];
        
        // Generate mock images (replace with actual API call)
        const images = sentences.map((sentence, index) => ({
            prompt: sentence,
            genre,
            style,
            imageUrl: `https://via.placeholder.com/800x600/cccccc/969696?text=${encodeURIComponent(sentence.substring(0, 30))}`,
            timestamp: new Date().toISOString()
        }));

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json({ success: true, images });
    } catch (error) {
        console.error('Error in image generation:', error);
        res.status(500).json({ error: 'Failed to generate images' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    process.exit(1);
});
