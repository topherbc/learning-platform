
import React, { useState } from 'react';
import { callClaudeAPI } from '../services/claude-api';

function Chat({ lesson }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      text: `Let's learn about ${lesson.title}! Here's the exercise:\n\n${lesson.exercise.prompt}`
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChatHistory([
      ...chatHistory,
      { type: 'user', text: userInput }
    ]);

    const response = await callClaudeAPI(userInput, chatHistory, lesson);

    setChatHistory([
      ...chatHistory,
      { type: 'user', text: userInput },
      { type: 'bot', text: response },
    ]);

    setUserInput('');
  };

  return (
    <div className="border p-4">
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

export default Chat;
