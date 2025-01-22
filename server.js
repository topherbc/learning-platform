require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define port - check both environment variable and default
const PORT = process.env.SERVER_PORT || 3001;

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
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

// Start server with error handling
app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});