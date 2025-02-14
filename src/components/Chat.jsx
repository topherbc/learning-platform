import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateResponse } from '../services/api';
import { LEARNING_STAGES, generateInitialPrompt, determineNextStage } from '../services/promptSystem';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentStage, setCurrentStage] = useState(LEARNING_STAGES.INITIAL);
  const [currentTopic, setCurrentTopic] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      navigate('/onboarding');
      return;
    }

    try {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
      
      // Initialize chat with personalized prompt
      const initializeChat = async () => {
        try {
          const initialPrompt = generateInitialPrompt(parsedProfile);
          setCurrentTopic(initialPrompt.topic);
          setMessages([{
            type: 'assistant',
            content: initialPrompt.prompt,
            topic: initialPrompt.topic,
            stage: initialPrompt.stage
          }]);
        } catch (err) {
          console.error('Error initializing chat:', err);
          setError('Failed to initialize chat. Please try refreshing the page.');
        }
      };
      
      initializeChat();
    } catch (err) {
      console.error('Error parsing user profile:', err);
      navigate('/onboarding');
    }
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
      content: input,
      topic: currentTopic,
      stage: currentStage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Update learning stage based on user response
      const nextStage = determineNextStage(currentStage, input);
      setCurrentStage(nextStage);

      const response = await generateResponse(
        { 
          content: input, 
          topic: currentTopic,
          lastResponse: messages[messages.length - 1]?.content 
        }, 
        userProfile,
        nextStage
      );

      const assistantMessage = {
        type: 'assistant',
        content: response,
        topic: currentTopic,
        stage: nextStage,
        ...(response.code && { code: response.code })
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorContent = error.response?.data?.message || 
        'I apologize, but I encountered an error. Please try again.';
      
      const errorMessage = {
        type: 'assistant',
        content: errorContent,
        isError: true,
        stage: currentStage,
        topic: currentTopic
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(errorContent);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message, index) => {
    const messageClasses = message.type === 'user'
      ? 'bg-blue-100 ml-auto'
      : message.isError
        ? 'bg-red-50 border border-red-100'
        : 'bg-gray-100';

    const stageIndicator = message.stage ? (
      <div className="text-xs text-gray-500 mb-1">
        {message.stage.charAt(0).toUpperCase() + message.stage.slice(1)} Stage
      </div>
    ) : null;

    return (
      <div
        key={index}
        className={`${messageClasses} rounded-lg p-4 my-2 max-w-3/4 break-words`}
      >
        {stageIndicator}
        {message.code ? (
          <div>
            <p className="mb-2">{message.content}</p>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <code>{message.code}</code>
            </pre>
          </div>
        ) : (
          <p className={message.isError ? 'text-red-600' : ''}>{message.content}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {error && (
        <div className="bg-red-50 p-4 fixed top-0 left-0 right-0">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
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
            className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;