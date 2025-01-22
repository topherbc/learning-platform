export const lessons = {
  basicPython: {
    id: 'basic-python',
    title: 'Basic Python',
    description: 'Learn the fundamentals of Python programming',
    modules: [
      {
        id: 'variables',
        title: 'Variables and Data Types',
        introduction: "Let's start with Python variables! Variables are like containers that store data. They're fundamental to programming.",
        concepts: ['variable declaration', 'basic data types', 'type conversion'],
        exercises: [
          {
            id: 'var-1',
            prompt: 'Create a variable named "age" and assign it your age',
            solution: 'age = 25',
            hints: ['Variables don\'t need type declaration in Python', 'Use the assignment operator (=)']
          }
        ]
      },
      {
        id: 'operations',
        title: 'Basic Operations',
        introduction: "Now we'll learn about performing calculations and operations in Python!",
        concepts: ['arithmetic operators', 'comparison operators', 'logical operators'],
        exercises: [
          {
            id: 'op-1',
            prompt: 'Calculate the sum of 5 and 3',
            solution: '5 + 3',
            hints: ['Use the + operator for addition']
          }
        ]
      }
    ]
  }
};

export const DEFAULT_LESSON = 'basic-python-variables';

export const getCurrentLesson = (lessonId) => {
  if (!lessonId) {
    return getDefaultLesson();
  }
  
  try {
    const [course, module] = lessonId.split('-');
    return lessons[course]?.modules.find(m => m.id === module) || getDefaultLesson();
  } catch (error) {
    console.error('Error getting current lesson:', error);
    return getDefaultLesson();
  }
};

export const getDefaultLesson = () => {
  const [course, module] = DEFAULT_LESSON.split('-');
  return lessons[course].modules.find(m => m.id === module);
};

export const getNextLesson = (currentLessonId) => {
  try {
    const [course, module] = currentLessonId.split('-');
    const courseModules = lessons[course]?.modules;
    if (!courseModules) return null;
    
    const currentIndex = courseModules.findIndex(m => m.id === module);
    return currentIndex < courseModules.length - 1 
      ? `${course}-${courseModules[currentIndex + 1].id}`
      : null;
  } catch (error) {
    console.error('Error getting next lesson:', error);
    return null;
  }
};