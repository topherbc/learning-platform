// src/services/claudeApi.js
const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

class ClaudeApiService {
  constructor() {
    if (!CLAUDE_API_KEY) {
      console.warn('Claude API key not found. Please set REACT_APP_CLAUDE_API_KEY in your environment.');
    }
  }

  async sendMessage(content, options = {}) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2024-01-01'
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4096,
          messages: [{
            role: "user",
            content
          }],
          ...options
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response from Claude');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to communicate with Claude API');
    }
  }

  async evaluateCode(code, topic) {
    const prompt = `As a Python tutor, please evaluate this code in the context of learning about ${topic || 'Python basics'}:

${code}

Please provide:
1. Whether the code is correct
2. Any potential improvements
3. An explanation of what the code does
4. Example output if applicable`;

    return this.sendMessage(prompt);
  }

  async getNextLesson({ currentTopic, completedLessons = [] }) {
    const prompt = `As a Python tutor, please provide guidance for learning ${currentTopic || 'Python basics'}. 
Context: The student has completed these lessons: ${completedLessons.join(', ') || 'None yet'}.

Please provide:
1. A brief explanation of the next concept to learn
2. A simple example
3. An exercise to practice`;

    return this.sendMessage(prompt);
  }
}

export default new ClaudeApiService();