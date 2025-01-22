import React, { useState } from 'react';
import Chat from './components/Chat';
import { lessons } from './data/lessons';

function App() {
  const [currentCourse] = useState('basicPython');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  const currentModule = lessons[currentCourse].modules[currentModuleIndex];

  const handleNext = () => {
    if (currentModuleIndex < lessons[currentCourse].modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{currentModule.title}</h1>
      <p className="mb-8">{currentModule.introduction}</p>
      <Chat lesson={currentModule} />
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
        onClick={handleNext}
        disabled={currentModuleIndex === lessons[currentCourse].modules.length - 1}
      >
        Next Lesson
      </button>
    </div>
  );
}

export default App;