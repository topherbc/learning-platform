
import React, { useState } from 'react';

function Chat({ lesson }) {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Check user input against lesson.exercise.solution
    setUserInput('');
  };

  return (
    <div className="chat">
      {lesson.content.map((item, index) => (
        <div key={index}>
          {item.type === 'text' && <p>{item.text}</p>}
          {item.type === 'code' && (
            <pre>
              <code>{item.text}</code>
            </pre>
          )}
        </div>
      ))}

      <h3>Exercise:</h3>  
      <p>{lesson.exercise.prompt}</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={10}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Chat;
