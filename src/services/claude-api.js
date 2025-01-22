// Helper function to generate context based on user profile
const generateContext = (userProfile) => {
  const {
    experience,
    goals,
    preferredLearningStyle,
    timeCommitment
  } = userProfile;

  return `
    User Profile:
    - Experience Level: ${experience}
    - Learning Goals: ${goals.join(', ')}
    - Preferred Learning Style: ${preferredLearningStyle}
    - Time Commitment: ${timeCommitment}
  `;
};

// Helper to determine appropriate response style
const getResponseStyle = (learningStyle) => {
  switch (learningStyle) {
    case 'visual':
      return 'with diagrams and visual examples';
    case 'practical':
      return 'with hands-on exercises and practical examples';
    case 'conceptual':
      return 'with thorough explanations of underlying concepts';
    case 'interactive':
      return 'with interactive examples and discussion points';
    default:
      return 'with a balanced approach';
  }
};

// Main function to generate responses
export const generateResponse = async (userInput, userProfile) => {
  try {
    const context = generateContext(userProfile);
    const responseStyle = getResponseStyle(userProfile.preferredLearningStyle);

    const prompt = `
      Context: ${context}
      
      Respond to the following query ${responseStyle}, keeping in mind the user's 
      experience level and learning goals.
      
      User Query: ${userInput}
    `;

    // Replace this with your actual API call
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userProfile
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
};

// Function to track learning progress
export const trackProgress = async (userProfile, interaction) => {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        interaction,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to track progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking progress:', error);
    throw error;
  }
};

// Function to get personalized learning suggestions
export const getLearningsuggestions = async (userProfile) => {
  try {
    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        progressHistory: await getProgressHistory(userProfile)
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get learning suggestions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
};

// Function to get progress history
export const getProgressHistory = async (userProfile) => {
  try {
    const response = await fetch(`/api/progress/${userProfile.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get progress history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting progress history:', error);
    throw error;
  }
};

// Function to update learning preferences
export const updateLearningPreferences = async (userProfile, newPreferences) => {
  try {
    const response = await fetch('/api/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        preferences: newPreferences
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Function to evaluate user understanding
export const evaluateUnderstanding = async (userProfile, topic, response) => {
  try {
    const evaluation = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        topic,
        response
      }),
    });

    if (!evaluation.ok) {
      throw new Error('Failed to evaluate understanding');
    }

    return await evaluation.json();
  } catch (error) {
    console.error('Error evaluating understanding:', error);
    throw error;
  }
};

export default {
  generateResponse,
  trackProgress,
  getLearningsuggestions,
  getProgressHistory,
  updateLearningPreferences,
  evaluateUnderstanding
};