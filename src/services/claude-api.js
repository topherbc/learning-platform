
export async function callClaudeAPI(userInput, chatHistory, currentLesson) {
  const response = await fetch('https://api.anthropic.com/v1/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.REACT_APP_CLAUDE_API_KEY,
    },
    body: JSON.stringify({
      prompt: `
        The following is a conversation with a Python learning assistant. The assistant is currently teaching a lesson on ${currentLesson.title}.
        
        Chat history:
        ${chatHistory.map(entry => `${entry.type === 'user' ? 'Student' : 'Assistant'}: ${entry.text}`).join('\n')}
        
        Student: ${userInput}
        Assistant:`,
      model: 'claude-v1',
      max_tokens_to_sample: 500,
    }),
  });

  const data = await response.json();
  return data.completion;
}
