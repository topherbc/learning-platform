
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
    <div className="app">
      <h1>{lessons[currentLesson].title}</h1>
      <p>{lessons[currentLesson].description}</p>
      <Chat lesson={lessons[currentLesson]} />
      <button onClick={handleNext} disabled={currentLesson === lessons.length - 1}>
        Next Lesson
      </button>
    </div>
  );
}

export default App;
