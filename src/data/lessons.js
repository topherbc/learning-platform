
export const lessons = [
  {
    id: 1,
    title: 'Variables',
    description: 'Learn about variables in Python',
    content: [
      {
        type: 'text',
        text: 'In Python, variables are used to store values. You can assign a value to a variable using the = operator.'
      },
      {
        type: 'code',  
        text: "x = 42\nprint(x)  # Output: 42"
      },
      {
        type: 'text',
        text: 'Python variables can store different types of data like numbers, strings, lists, etc.'  
      },
      {
        type: 'code',
        text: "name = 'Alice'\nage = 30\nheights = [1.6, 1.8, 1.5]"
      },
      {
        type: 'text', 
        text: 'Now try creating some variables yourself!'
      }
    ],
    exercise: {
      type: 'code',
      prompt: 'Create two variables to store your name and age, then print them out.',
      solution: "name = 'Your Name'\nage = 25\nprint(name)\nprint(age)" 
    }
  },
  {
    id: 2, 
    title: 'Basic Operations',
    description: 'Learn about basic math operations in Python',
    content: [
      {
        type: 'text',
        text: 'Python supports basic mathematical operations like addition, subtraction, multiplication and division.'
      },
      {
        type: 'code',
        text: "x = 10\ny = 5\n\nprint(x + y)  # Addition\nprint(x - y)  # Subtraction \nprint(x * y)  # Multiplication\nprint(x / y)  # Division"
      },
      {
        type: 'text',
        text: 'You can also use parentheses to control the order of operations, just like in regular math.'
      }
    ],
    exercise: {
      type: 'code',
      prompt: 'Calculate the result of (10 + 5) * 2 and print it out.',
      solution: "result = (10 + 5) * 2\nprint(result)"
    }
  },
  {
    id: 3,
    title: 'Conditional Statements', 
    description: 'Learn about if/else statements in Python',
    content: [
      {
        type: 'text',
        text: 'Conditional statements allow you to execute different code based on whether a condition is true or false.'  
      },
      {  
        type: 'code',
        text: "x = 10\n\nif x > 5:\n  print('x is greater than 5')\nelse:\n  print('x is less than or equal to 5')"
      },
      {
        type:'text',
        text: 'You can chain multiple conditions together using elif.'
      },
      {
        type: 'code',  
        text: "score = 85\n\nif score >= 90:\n  grade = 'A' \nelif score >= 80:\n  grade = 'B'\nelse:\n  grade = 'C'\n\nprint(grade)"
      }
    ],
    exercise: {
      type: 'code',
      prompt: "Write code that prints 'Pass' if a score variable is 60 or above, and prints 'Fail' otherwise.",
      solution: "score = 75\nif score >= 60:\n  print('Pass') \nelse:\n  print('Fail')"      
    }
  },
  {
    id: 4,
    title: 'Print Statements',
    description: 'Learn how to output text in Python',  
    content: [
      {
        type: 'text',
        text: "You can output text in Python using the print() function. Whatever you put inside the parentheses will be displayed."
      },
      {  
        type: 'code',
        text: "print('Hello World!')"
      },  
      {
        type: 'text', 
        text: "To print variables, you can pass them inside the print function. You can print multiple things by separating them with commas."
      },
      {
        type: 'code',
        text: "name = 'Alice' \nage = 25\n\nprint('My name is', name, 'and I am', age, 'years old.')"
      }
    ],
    exercise: {
      type: 'code', 
      prompt: "Create variables for your favorite food and color, then print a statement like 'I love eating (food) and my favorite color is (color)!'",
      solution: "food = 'pizza'\ncolor = 'blue'  \nprint('I love eating', food, 'and my favorite color is', color + '!')"
    }
  }
];
