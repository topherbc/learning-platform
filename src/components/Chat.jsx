import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateResponse } from '../services/claude-api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      navigate('/onboarding');
      return;
    }
    setUserProfile(JSON.parse(profile));
    
    // Initialize chat with personalized greeting
    const initializeChat = async () => {
      const parsedProfile = JSON.parse(profile);
      const initialMessage = {
        type: 'assistant',
        content: `Welcome ${parsedProfile.name}! Based on your interests in ${parsedProfile.goals.join(', ')}, 
          I'll help guide your learning journey. What would you like to focus on today?`
      };
      setMessages([initialMessage]);
    };
    
    initializeChat();
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input, userProfile);
      const assistantMessage = {
        type: 'assistant',
        content: response,
        code: response.code
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message, index) => {
    const messageClasses = message.type === 'user'
      ? 'bg-blue-100 ml-auto'
      : 'bg-gray-100';

    return (
      <div
        key={index}
        className={`${messageClasses} rounded-lg p-4 my-2 max-w-3/4 break-words`}
      >
        {message.code ? (
          <div>
            <p className="mb-2">{message.content}</p>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <code>{message.code}</code>
            </pre>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl">
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="container mx-auto max-w-4xl flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;