// AI service to process user input and provide responses
export const processUserInput = async (input, lessonId) => {
  try {
    // TODO: Replace with actual Claude API integration
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
        lessonId: lessonId,
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