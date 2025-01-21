// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import claudeApi from '../services/claudeApi';

const Chat = ({ currentLesson }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Determine if input is code by checking for Python keywords or indentation
      const isCode = /^(def|class|if|for|while|import|from|print)|^\s{2,}/.test(input);

      let response;
      if (isCode) {
        response = await claudeApi.evaluateCode(input, currentLesson.topic);
      } else {
        response = await claudeApi.getNextLesson({
          currentTopic: currentLesson.topic,
          completedLessons: currentLesson.completed
        });
      }

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            <pre className="whitespace-pre-wrap font-mono">
              {message.content}
            </pre>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message or paste code here..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;