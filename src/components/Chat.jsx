import React, { useState, useEffect, useRef } from 'react';
import { lessons } from '../data/lessons';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentLesson, setCurrentLesson] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      // Start with welcome message
      setMessages([{
        type: 'system',
        content: lessons[0].introduction
      }]);
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { type: 'user', content: input },
      { type: 'system', content: processUserInput(input) }
    ];

    setMessages(newMessages);
    setInput('');
  };

  const processUserInput = (userInput) => {
    const currentPrompt = lessons[currentLesson];
    const nextLesson = currentLesson + 1;
    
    // Simple pattern matching for now
    if (userInput.toLowerCase().includes(currentPrompt.expectedResponse.toLowerCase())) {
      if (nextLesson < lessons.length) {
        setCurrentLesson(nextLesson);
        return `Correct! ${currentPrompt.completion}\n\nNext lesson:\n${lessons[nextLesson].introduction}`;
      } else {
        return 'Congratulations! You\'ve completed all the basic lessons!';
      }
    }
    
    return currentPrompt.hint || 'Try again. Remember to follow the instruction carefully.';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${message.type === 'user' 
              ? 'bg-blue-100 ml-auto max-w-[80%]' 
              : 'bg-gray-100 mr-auto max-w-[80%]'}`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg border p-2 focus:outline-none focus:border-blue-500"
            placeholder="Type your answer..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;