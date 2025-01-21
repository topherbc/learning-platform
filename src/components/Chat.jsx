
import React, { useState } from 'react';

function Chat({ lesson }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the user's code to the AI model for review
    const feedback = await reviewCode(userInput, lesson.exercise.solution);

    setChatHistory([
      ...chatHistory,
      { type: 'user', text: userInput },
      { type: 'bot', text: feedback.message, },
    ]);

    setUserInput('');
  };

  return (
    <div className="border p-4">
      <div className="mb-4">
        {lesson.content.map((item, index) => (
          <div key={index} className="mb-2">
            {item.type === 'text' && <p>{item.text}</p>}
            {item.type === 'code' && (
              <pre className="bg-gray-100 p-2">
                <code>{item.text}</code>
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Exercise:</h3>
        <p>{lesson.exercise.prompt}</p>
      </div>

      <div className="mb-4">
        {chatHistory.map((entry, index) => (
          <div key={index} className={`mb-2 ${entry.type === 'user' ? 'text-right' : ''}`}>
            <span className={`inline-block p-2 rounded ${entry.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {entry.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 mb-2"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={5}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

async function reviewCode(userCode, solutionCode) {
  // Replace this with a real API call to the AI service
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userCode.trim() === solutionCode.trim()) {
        resolve({ 
          isCorrect: true,
          message: 'Great job! Your code looks perfect.',
        });
      } else {
        resolve({
          isCorrect: false,
          message: "Close, but not quite. Make sure you're declaring the variables correctly and printing them in the right order.",  
        });
      }
    }, 1000);
  });
}

export default Chat;
