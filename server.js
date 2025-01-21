const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Claude API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validate request
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Claude API integration using environment variable
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured');
    }

    // Your Claude API logic here
    // Example:
    // const response = await anthropic.messages.create({...})

    res.json({ response: response.content });
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Claude API' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});