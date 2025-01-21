class ClaudeApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to communicate with Claude API');
      }

      return await response.json();
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Failed to communicate with Claude API: ${error.message}`);
    }
  }
}

export const claudeApi = new ClaudeApiService();