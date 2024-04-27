export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

// TODO: metadata such as:
// timestamp of message creation
// origin of message (api or local)

// TODO: can simplify the typescript definitions by setting chatROle as ChatMessage['role']
export interface BaseMessage {
  role: ChatRole;
  content?: string;
  name?: string;
}

export interface SystemMessage extends BaseMessage {
  role: 'system';
  content: string;
}

// TODO: handle images
export interface UserMessage extends BaseMessage {
  role: 'user';
  content: string;
}

export interface AssistantMessage extends BaseMessage {
  role: 'assistant';
  tool_calls?: ToolCall[];
  content: string;
}

export interface ToolMessage extends BaseMessage {
  role: 'tool';
  content: string;
  tool_call_id: string;
}

export interface FunctionCall {
  arguments: string;
  name: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: FunctionCall;
}

export type ChatMessage = SystemMessage | UserMessage | AssistantMessage | ToolMessage;

export type ChatHistory = ChatMessage[];

export function prettyFormatChatHistory(history: ChatHistory): string {
  return history
    .map((message) => {
      switch (message.role) {
        case 'system':
          return `[System] ${message.content}`;
        case 'user':
          return `[User] ${message.content}`;
        case 'assistant':
          const toolCalls = message.tool_calls
            ? message.tool_calls
                .map((toolCall) => `[Tool Call] ${toolCall.function.name}(${toolCall.function.arguments})`)
                .join('\n')
            : '';
          return `[Assistant] ${message.content}${toolCalls ? `\n${toolCalls}` : ''}`;
        case 'tool':
          return `[Tool] ${message.content}`;
        default:
          return '';
      }
    })
    .join('\n');
}

export function systemMessage(content: string): SystemMessage {
  return {
    role: 'system',
    content,
  };
}

export function userMessage(content: string): UserMessage {
  return {
    role: 'user',
    content,
  };
}

export function assistantMessage(content: string, tool_calls?: ToolCall[]): AssistantMessage {
  return {
    role: 'assistant',
    content,
    tool_calls,
  };
}

export function toolMessage(content: string, tool_call_id: string): ToolMessage {
  return {
    role: 'tool',
    content,
    tool_call_id,
  };
}
