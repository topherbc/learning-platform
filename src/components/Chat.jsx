import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getCurrentLesson } from '../data/lessons';
import { processUserInput, extractCodeBlock, formatCodeBlock } from '../services/claude-api';

const Chat = ({ lessonId }) => {
  const [messages, setMessages] = useLocalStorage(`chat-${lessonId}`, []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  useEffect(() => {
    const lesson = getCurrentLesson(lessonId);
    // Find first incomplete exercise
    const exercise = lesson.exercises.find(ex => !ex.completed);
    setCurrentExercise(exercise);

    // Initialize chat with lesson intro if empty
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `${lesson.introduction}\n\nLet's start with the first exercise:\n${exercise?.prompt || 'No exercises available'}`
      }]);
    }
  }, [lessonId, messages.length, setMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Check if input contains code block
    const hasCode = inputValue.includes('```python');
    let formattedInput = inputValue;

    // If no code block but looks like code, wrap it
    if (!hasCode && inputValue.includes('=')) {
      formattedInput = formatCodeBlock(inputValue);
    }

    const newMessage = {
      role: 'user',
      content: formattedInput
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Convert messages to Claude API format
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await processUserInput(
        formattedInput, 
        lessonId,
        conversationHistory
      );
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);

      // If code was submitted and evaluated correctly, update exercise status
      const code = extractCodeBlock(formattedInput);
      if (code && response.includes('Correct!') && currentExercise) {
        currentExercise.completed = true;
        const lesson = getCurrentLesson(lessonId);
        const nextExercise = lesson.exercises.find(ex => !ex.completed);
        setCurrentExercise(nextExercise);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-8' 
                : 'bg-gray-100 mr-8'
            }`}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-100">●</span>
            <span className="animate-bounce delay-200">●</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message or code here..."
            className="flex-1 p-2 border rounded resize-none"
            rows="3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;