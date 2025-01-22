// src/services/promptSystem.js
export const LEARNING_STAGES = {
  INITIAL: 'initial',
  CONCEPT: 'concept',
  PRACTICE: 'practice',
  REVIEW: 'review',
  ASSESSMENT: 'assessment'
};

// Helper to determine the initial topic based on goals and experience
const determineInitialTopic = (goals, experience) => {
  return `Introduction to ${goals[0]}`;
};

export const generateInitialPrompt = (userProfile) => {
  const { experience, goals, preferredLearningStyle, timeCommitment, name } = userProfile;
  const initialTopic = determineInitialTopic(goals, experience);
  
  return {
    prompt: `Welcome ${name}! I'll be your AI learning assistant for ${goals.join(', ')}. 
Based on your ${experience} experience level and ${timeCommitment} time commitment, 
let's start with ${initialTopic}.

Would you like me to:
1. Explain the core concepts
2. Show practical examples
3. Start with an interactive exercise
4. Give an overview of what we'll cover

How would you prefer to begin?`,
    topic: initialTopic,
    stage: LEARNING_STAGES.INITIAL
  };
};

export const generateNextPrompt = (userProfile, currentStage, lastInteraction) => {
  const { topic, response } = lastInteraction;
  const { experience, preferredLearningStyle } = userProfile;

  // Add contextual awareness based on learning style
  const styleBasedPrompts = {
    visual: 'with diagrams and visual examples',
    practical: 'through hands-on examples',
    conceptual: 'with detailed explanations',
    interactive: 'through interactive exercises'
  };

  const stylePrompt = styleBasedPrompts[preferredLearningStyle] || '';

  switch (currentStage) {
    case LEARNING_STAGES.CONCEPT:
      return {
        prompt: `Now that we've introduced ${topic}, let's explore the key concepts ${stylePrompt}. 
What specific aspect would you like to understand better?`,
        topic,
        stage: LEARNING_STAGES.CONCEPT
      };

    case LEARNING_STAGES.PRACTICE:
      return {
        prompt: `Let's practice what we've learned about ${topic}. 
I'll provide an exercise appropriate for your ${experience} experience level. 
Would you like to start with a simple example or jump into a challenge?`,
        topic,
        stage: LEARNING_STAGES.PRACTICE
      };

    case LEARNING_STAGES.REVIEW:
      return {
        prompt: `Great progress with ${topic}! Let's review what we've covered. 
Can you explain the main concepts in your own words? 
This will help me understand what to focus on next.`,
        topic,
        stage: LEARNING_STAGES.REVIEW
      };

    case LEARNING_STAGES.ASSESSMENT:
      return {
        prompt: `To make sure you're comfortable with ${topic} before moving on, 
could you solve this problem? Take your time and explain your thinking:

[Contextual practice problem based on previous interactions]`,
        topic,
        stage: LEARNING_STAGES.ASSESSMENT
      };

    default:
      return generateInitialPrompt(userProfile);
  }
};

export const determineNextStage = (currentStage, userResponse) => {
  // Simple keyword-based analysis for stage progression
  const keywords = userResponse.toLowerCase();
  
  if (keywords.includes('understand') || keywords.includes('explain')) {
    return LEARNING_STAGES.CONCEPT;
  } else if (keywords.includes('practice') || keywords.includes('exercise')) {
    return LEARNING_STAGES.PRACTICE;
  } else if (keywords.includes('review') || keywords.includes('recap')) {
    return LEARNING_STAGES.REVIEW;
  } else if (keywords.includes('test') || keywords.includes('check')) {
    return LEARNING_STAGES.ASSESSMENT;
  }
  
  // Progressive stage advancement
  const stages = Object.values(LEARNING_STAGES);
  const currentIndex = stages.indexOf(currentStage);
  return stages[currentIndex + 1] || LEARNING_STAGES.CONCEPT;
};