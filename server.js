require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define port - check both environment variable and default
const PORT = process.env.SERVER_PORT || 3001;

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, userProfile } = req.body;
    
    // Validate required fields
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Here you would typically make the actual call to Claude API
    // For now, returning a mock response
    const response = {
      response: `This is a response to: ${prompt}\nBased on user profile: ${JSON.stringify(userProfile)}`,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test route for the learning platform
app.get('/api/lessons', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    lessons: [
      { id: 1, title: 'Introduction to Python' }
    ]
  });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server with error handling
app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});