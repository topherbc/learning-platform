
import React, { useState } from 'react';
import Chat from './components/Chat';
import { lessons } from './data/lessons';

function App() {
  const [currentLesson, setCurrentLesson] = useState(0);

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{lessons[currentLesson].title}</h1>
      <p className="mb-8">{lessons[currentLesson].description}</p>
      <Chat lesson={lessons[currentLesson]} />
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
        onClick={handleNext}
        disabled={currentLesson === lessons.length - 1}
      >
        Next Lesson
      </button>
    </div>
  );
}

export default App;
