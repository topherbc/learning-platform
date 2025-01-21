import React, { useState, useRef, useEffect } from 'react';
import { claudeApi } from '../services/claudeApi';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
    };

    try {
      setIsLoading(true);
      setError(null);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      // Get current lesson context if needed
      const currentLesson = localStorage.getItem('currentLesson');
      const context = currentLesson ? `Current lesson: ${currentLesson}` : '';

      const response = await claudeApi.sendMessage(inputValue, context);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.message,
          code: response.code,
        },
      ]);
    } catch (err) {
      setError(err.message);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    return (
      <div
        key={index}
        className={`p-4 rounded-lg mb-4 ${
          isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
        } max-w-[80%]`}
      >
        <div className="font-medium mb-1">{isUser ? 'You' : 'Assistant'}</div>
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.code && (
          <pre className="bg-gray-800 text-white p-4 rounded mt-2 overflow-x-auto">
            <code>{message.code}</code>
          </pre>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => renderMessage(message, index))}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded ${
            isLoading
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
