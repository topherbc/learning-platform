
import React, { useState } from 'react';

function Chat({ lesson }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = userInput.trim() === lesson.exercise.solution.trim();
    const feedback = isCorrect ? 'Correct!' : 'Not quite, please try again.';

    setChatHistory([
      ...chatHistory,
      { type: 'user', text: userInput },
      { type: 'bot', text: feedback },  
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

export default Chat;
