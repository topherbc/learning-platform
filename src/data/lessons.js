const lessons = {
  'python-basics-1': {
    id: 'python-basics-1',
    title: 'Python Basics - Variables and Operations',
    concepts: ['variables', 'data types', 'basic operations'],
    description: 'Introduction to Python variables and basic operations',
    exercises: [
      {
        id: 'ex1',
        title: 'Create a Variable',
        description: 'Create a variable named `age` and assign it the value 25',
        solution: 'age = 25',
        completed: false
      },
      {
        id: 'ex2',
        title: 'Basic Operations',
        description: 'Create two variables `x` and `y` with values 10 and 5, then add them together in a variable called `sum`',
        solution: ['x = 10', 'y = 5', 'sum = x + y'],
        completed: false
      }
    ]
  }
};

module.exports = lessons;