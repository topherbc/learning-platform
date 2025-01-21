// src/services/claudeApi.js

const RATE_LIMIT_INTERVAL = 1000; // 1 second between requests
let lastRequestTime = 0;

class ClaudeAPIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_CLAUDE_API_URL || 'https://api.anthropic.com/v1';
    this.apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
    this.model = 'claude-3-sonnet-20240229';
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT_INTERVAL - timeSinceLastRequest)
      );
    }
    lastRequestTime = Date.now();
  }

  async evaluateCode(code, context) {
    try {
      await this.enforceRateLimit();
      
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{
            role: 'user',
            content: `Evaluate this Python code in the context of ${context}:\n\n${code}\n\nProvide feedback on:\n1. Code correctness\n2. Best practices\n3. Potential improvements\n4. Common pitfalls to avoid`
          }],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Code evaluation error:', error);
      throw new Error('Failed to evaluate code. Please try again.');
    }
  }

  async getNextLesson(currentProgress) {
    try {
      await this.enforceRateLimit();

      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{
            role: 'user',
            content: `Based on the user's current progress: ${JSON.stringify(currentProgress)}, \nsuggest the next Python lesson focusing on:\n1. Current skill level\n2. Previous challenges\n3. Learning path optimization\n4. Appropriate difficulty progression`
          }],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Next lesson error:', error);
      throw new Error('Failed to get next lesson. Please try again.');
    }
  }
}

export default new ClaudeAPIService();