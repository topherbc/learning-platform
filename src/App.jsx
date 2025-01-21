import React from 'react';
import Chat from './components/Chat';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Python Learning Platform</h1>
          <p className="text-gray-600 mt-2">Learn Python through conversation</p>
        </header>
        <main>
          <Chat />
        </main>
      </div>
    </div>
  );
}

export default App;