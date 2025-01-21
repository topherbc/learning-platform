const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
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

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: CLAUDE_API_KEY,
    });

    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: message
      }]
    });

    // Send response back to client
    res.json({ 
      response: response.content[0].text,
      messageId: response.id
    });
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Claude API' });
  }
});

// Force port 3001 for backend
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});