import { ChatHistory, AssistantMessage } from './Message';

export interface ChatModel {
  call(messages: ChatHistory): Promise<ChatResponse>;
}

export interface ChatResponse {
  history: ChatHistory;
  answer: AssistantMessage;
  rawResponse: unknown;
}

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
