class ClaudeApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_CLAUDE_API_URL || 'http://localhost:3001/api';
    this.apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
  }

  async sendMessage(message, context = '') {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format: Expected JSON');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Failed to communicate with Claude API: ${error.message}`);
    }
  }

  async validateCode(code) {
    try {
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Code validation error:', error);
      throw new Error('Failed to validate code');
    }
  }
}

export const claudeApi = new ClaudeApiService();
