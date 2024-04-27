export interface ToolData {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      [x: string]: unknown;
    };
  };
}

export interface Tool<T = { [key: string]: unknown }> {
  data: ToolData;
  execute: (input: T) => Promise<string>;
}

interface ToolParameters {
  [key: string]: {
    type: string;
    description: string;
  };
}

export function createTool(
  name: string,
  description: string,
  parameters: ToolParameters,
  execute: (input: Record<string, unknown>) => Promise<string>,
): Tool {
  return {
    data: {
      type: 'function',
      function: {
        name,
        description,
        parameters: {
          type: 'object',
          properties: parameters,
        },
      },
    },
    execute,
  };
}
