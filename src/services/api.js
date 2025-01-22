// src/services/api.js
import { generateInitialPrompt, generateNextPrompt } from './promptSystem';

export const generateResponse = async (userInput, userProfile, learningStage) => {
  try {
    let promptData = learningStage === 'initial' 
      ? generateInitialPrompt(userProfile)
      : generateNextPrompt(userProfile, learningStage, {
          topic: userInput.topic,
          response: userInput.content
        });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptData.prompt,
        userProfile,
        learningStage: promptData.stage,
        topic: promptData.topic
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    
    // Track this interaction
    await trackProgress(userProfile, {
      stage: promptData.stage,
      topic: promptData.topic,
      response: data.response
    });

    return data.response;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
};

export const trackProgress = async (userProfile, interaction) => {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
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

// Define the API object with all functions
const api = {
  generateResponse,
  trackProgress,
  evaluateUnderstanding
};

export default api;