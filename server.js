const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Claude API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, learningPath, conversationHistory } = req.body;
    
    // Construct the system prompt for Claude
    const systemPrompt = `You are a Python programming teacher.
Learning Path: ${learningPath || 'Basic Python'}
Your role: Guide the student through Python programming concepts, evaluate their code, provide feedback, and answer questions.

When evaluating code:
1. Check for Python syntax correctness
2. Verify if it meets the exercise requirements
3. Provide constructive feedback
4. Suggest improvements if needed
5. Keep track of progress and concept mastery

Teaching Style:
- Break down complex concepts into simple steps
- Provide real-world examples
- Encourage hands-on practice
- Adapt to student's learning pace
- Use positive reinforcement`;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message }
      ]
    });

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