// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import claudeApi from '../services/claudeApi';

const defaultLesson = {
  topic: 'Python basics',
  completed: []
};

const Chat = ({ currentLesson = defaultLesson }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (err) {
        console.error('Failed to parse chat history:', err);
        localStorage.removeItem('chatHistory');
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save chat history:', err);
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Welcome message when chat is empty
    if (messages.length === 0) {
      setMessages([{
        type: 'assistant',
        content: `Welcome to the Python Learning Platform! We're currently focusing on ${currentLesson.topic}. Feel free to ask questions or paste code for evaluation.`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

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
      const isCode = /^(def|class|if|for|while|import|from|print)|^\s{2,}/.test(input);
      const response = await (isCode 
        ? claudeApi.evaluateCode(input, currentLesson.topic)
        : claudeApi.getNextLesson({
            currentTopic: currentLesson.topic,
            completedLessons: currentLesson.completed
          }));

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Current Topic: {currentLesson.topic}</h2>
        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear Chat
        </button>
      </div>

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
            <pre className="whitespace-pre-wrap font-mono text-sm">
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