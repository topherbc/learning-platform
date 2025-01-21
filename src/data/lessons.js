// src/data/lessons.js

export const lessons = {
  variables: {
    id: 'variables',
    topic: 'Variables and Data Types',
    description: 'Learn about Python variables and basic data types',
    examples: [
      {
        description: 'Number variable',
        code: 'age = 25\nprint(age)'
      },
      {
        description: 'String variable',
        code: 'name = "Alice"\nprint(name)'
      }
    ],
    exercises: [
      {
        prompt: 'Create a variable called temperature and assign it the value 20.5',
        solution: 'temperature = 20.5'
      }
    ]
  },
  
  operations: {
    id: 'operations',
    topic: 'Basic Operations',
    description: 'Learn about arithmetic and string operations in Python',
    examples: [
      {
        description: 'Arithmetic operations',
        code: 'x = 10\ny = 5\nsum = x + y\nprint(sum)'
      }
    ],
    exercises: [
      {
        prompt: 'Calculate the product of 7 and 6',
        solution: 'product = 7 * 6\nprint(product)'
      }
    ]
  },
  
  conditionals: {
    id: 'conditionals',
    topic: 'Conditional Statements',
    description: 'Learn about if, elif, and else statements',
    examples: [
      {
        description: 'Basic if statement',
        code: 'age = 18\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")'
      }
    ],
    exercises: [
      {
        prompt: 'Write code to check if a number is positive or negative',
        solution: 'number = 10\nif number > 0:\n    print("Positive")\nelse:\n    print("Negative")'
      }
    ]
  },
  
  print: {
    id: 'print',
    topic: 'Print Statements',
    description: 'Learn about output formatting and print functions',
    examples: [
      {
        description: 'Basic print',
        code: 'print("Hello, World!")'
      },
      {
        description: 'Formatted print',
        code: 'name = "Bob"\nage = 30\nprint(f"{name} is {age} years old")'
      }
    ],
    exercises: [
      {
        prompt: 'Print your name and favorite color using string formatting',
        solution: 'name = "Alice"\ncolor = "blue"\nprint(f"My name is {name} and I like {color}")'
      }
    ]
  }
};

export const getLessonById = (id) => lessons[id] || null;

export const getNextLesson = (currentId) => {
  const lessonIds = Object.keys(lessons);
  const currentIndex = lessonIds.indexOf(currentId);
  if (currentIndex < lessonIds.length - 1) {
    return lessons[lessonIds[currentIndex + 1]];
  }
  return null;
};