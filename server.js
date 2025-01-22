require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define port - check both environment variable and default
const PORT = process.env.SERVER_PORT || 3001;

// Progress tracking - in-memory store for demo
const progressStore = new Map();

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, userProfile } = req.body;
    
    // Validate required fields
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Mock response for now
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

// Progress tracking endpoint
app.post('/api/progress', (req, res) => {
  try {
    const { userProfile, interaction, timestamp } = req.body;
    const userId = userProfile.id || 'anonymous';
    
    if (!progressStore.has(userId)) {
      progressStore.set(userId, []);
    }
    
    const userProgress = progressStore.get(userId);
    userProgress.push({ interaction, timestamp });
    
    res.json({ 
      success: true, 
      progress: userProgress 
    });
  } catch (error) {
    console.error('Progress Tracking Error:', error);
    res.status(500).json({ error: 'Failed to track progress' });
  }
});

// Get progress history
app.get('/api/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const progress = progressStore.get(userId) || [];
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Evaluation endpoint
app.post('/api/evaluate', (req, res) => {
  try {
    const { userProfile, topic, response } = req.body;
    
    // Mock evaluation logic
    const evaluation = {
      understanding: 'ready_for_next',
      confidence: 0.85,
      recommendations: ['Practice more examples', 'Review key concepts']
    };
    
    res.json(evaluation);
  } catch (error) {
    console.error('Evaluation Error:', error);
    res.status(500).json({ error: 'Failed to evaluate response' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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