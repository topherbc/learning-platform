export const processUserInput = async (input, lessonId, conversationHistory) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
        lessonId,
        conversationHistory
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process input');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in processUserInput:', error);
    throw error;
  }
};

// Helper function to extract code blocks from messages
export const extractCodeBlock = (message) => {
  const codeBlockRegex = /```python([\s\S]*?)```/;
  const match = message.match(codeBlockRegex);
  return match ? match[1].trim() : null;
};

// Helper function to format code blocks
export const formatCodeBlock = (code) => {
  return `\`\`\`python\n${code}\n\`\`\``;
};