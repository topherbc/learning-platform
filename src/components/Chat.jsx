
import React, { useState } from 'react';

function Chat({ lesson }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the user's actual input to the AI model for review
    const feedback = await reviewCode(userInput, lesson.exercise);

    setChatHistory([
      ...chatHistory,
      { type: 'user', text: userInput },
      { type: 'bot', text: feedback },
    ]);

    setUserInput('');
  };

  return (
    <div className="border p-4">
      {/* ... (rest of the component remains the same) ... */}
    </div>
  );
}

async function reviewCode(userCode, exercise) {
  // This is where we would make the actual API call to the AI service
  // For now, we'll simulate different responses based on the user's input
  
  if (userCode.includes('print')) {
    if (userCode.includes('input(')) {
      return "Great job! You're using the input() function to get the user's name and age, and printing them out.";
    } else {
      return "You're on the right track with using print statements. Don't forget to use input() to prompt the user for their name and age.";
    }
  } else {
    return "Hmm, I don't see any print statements in your code. Remember, the exercise is asking you to print out the user's name and age after prompting for them.";
  }
}

export default Chat;
