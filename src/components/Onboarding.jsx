import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    name: '',
    experience: '',
    goals: [],
    preferredLearningStyle: '',
    timeCommitment: '',
    interests: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (item, field) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    navigate('/chat');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Welcome! Let's get to know you</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">What's your name?</label>
              <input
                type="text"
                name="name"
                value={userProfile.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your experience level with programming</label>
              <select
                name="experience"
                value={userProfile.experience}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select experience level</option>
                <option value="beginner">Complete Beginner</option>
                <option value="some">Some Experience</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Learning Goals</h2>
            <div className="space-y-2">
              {['Web Development', 'Data Science', 'Mobile Apps', 'Game Development', 'Machine Learning', 'DevOps'].map(goal => (
                <label key={goal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userProfile.goals.includes(goal)}
                    onChange={() => handleMultiSelect(goal, 'goals')}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Learning Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred learning style</label>
              <select
                name="preferredLearningStyle"
                value={userProfile.preferredLearningStyle}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select learning style</option>
                <option value="visual">Visual Learning</option>
                <option value="practical">Hands-on Practice</option>
                <option value="conceptual">Conceptual Understanding</option>
                <option value="interactive">Interactive Discussions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time commitment</label>
              <select
                name="timeCommitment"
                value={userProfile.timeCommitment}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select time commitment</option>
                <option value="minimal">1-2 hours/week</option>
                <option value="moderate">3-5 hours/week</option>
                <option value="dedicated">6-10 hours/week</option>
                <option value="intensive">10+ hours/week</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {renderStep()}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep(prev => prev - 1)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(prev => prev + 1)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Start Learning
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;