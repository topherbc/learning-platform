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

const evaluateCode = (code, expectedOutput) => {
  try {
    // Basic syntax check
    new Function(code);
    
    // Compare with expected output if provided
    if (expectedOutput) {
      // TODO: Add more sophisticated comparison
      return code.includes(expectedOutput);
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Claude API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, lessonId, conversationHistory } = req.body;
    
    // Get current lesson content
    const currentLesson = lessons[lessonId];
    
    // Construct the system prompt for Claude
    const systemPrompt = `You are a Python programming teacher. 
Current lesson: ${currentLesson.title}
Concepts: ${currentLesson.concepts.join(', ')}
Your role: Guide the student through this lesson, evaluate their code, provide feedback, and answer questions.
Keep responses focused on the current topic: ${currentLesson.title}.

When evaluating code:
1. Check for Python syntax correctness
2. Verify if it meets the exercise requirements
3. Provide constructive feedback
4. Suggest improvements if needed
5. Mark as complete if correct`;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Check if the message contains code to evaluate
    const containsCode = message.includes('```python');
    if (containsCode) {
      const code = message.split('```python')[1].split('```')[0].trim();
      const exercise = currentLesson.exercises.find(ex => !ex.completed);
      if (exercise) {
        const isCorrect = evaluateCode(code, exercise.solution);
        systemPrompt += `\nCode evaluation result: ${isCorrect ? 'Correct' : 'Incorrect'}`;
      }
    }

    // Construct messages array with history
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: messages,
      system: systemPrompt
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