import { createTool } from '../src/Tool';

describe('createTool', () => {
  test('should create a tool with the provided information', () => {
    const greetTool = createTool(
      'greet',
      'Greet a person',
      {
        name: {
          type: 'string',
          description: 'The name of the person to greet',
        },
      },
      async (input) => {
        return `Hello, ${input.name}!`;
      },
    );

    expect(greetTool).toEqual({
      data: {
        type: 'function',
        function: {
          name: 'greet',
          description: 'Greet a person',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the person to greet',
              },
            },
          },
        },
      },
      execute: expect.any(Function),
    });

    expect(greetTool.execute({ name: 'John' })).resolves.toBe('Hello, John!');
  });
});
