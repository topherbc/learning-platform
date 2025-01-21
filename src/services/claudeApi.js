// src/services/claudeApi.js
class ClaudeApiService {
  async sendMessage(content, options = {}) {
    try {
      console.log('Sending request to Claude API...');
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4096,
          messages: [{
            role: "user",
            content: { type: "text", text: content }
          }],
          ...options
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Claude API Error Response:', data);
        throw new Error(data.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      return data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to communicate with Claude API');
    }
  }

  async evaluateCode(code, topic) {
    const prompt = `As a Python tutor, please evaluate this code in the context of learning about ${topic || 'Python basics'}:\n\n${code}\n\nPlease provide:\n1. Whether the code is correct\n2. Any potential improvements\n3. An explanation of what the code does\n4. Example output if applicable`;

    return this.sendMessage(prompt);
  }

  async getNextLesson({ currentTopic, completedLessons = [] }) {
    const prompt = `As a Python tutor, please provide guidance for learning ${currentTopic || 'Python basics'}. \nContext: The student has completed these lessons: ${completedLessons.join(', ') || 'None yet'}.\n\nPlease provide:\n1. A brief explanation of the next concept to learn\n2. A simple example\n3. An exercise to practice`;

    return this.sendMessage(prompt);
  }
}

export default new ClaudeApiService();