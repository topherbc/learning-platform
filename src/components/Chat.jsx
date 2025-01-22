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
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      navigate('/onboarding');
      return;
    }
    const parsedProfile = JSON.parse(profile);
    setUserProfile(parsedProfile);
    
    // Initialize chat with personalized prompt
    const initializeChat = async () => {
      const initialPrompt = generateInitialPrompt(parsedProfile);
      setCurrentTopic(initialPrompt.topic);
      setMessages([{
        type: 'assistant',
        content: initialPrompt.prompt,
        topic: initialPrompt.topic,
        stage: initialPrompt.stage
      }]);
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
      content: input,
      topic: currentTopic,
      stage: currentStage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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