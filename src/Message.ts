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

export interface ToolCall {
  id: string;
  type: 'function';
  function: object;
}

export type ChatMessage = SystemMessage | UserMessage | AssistantMessage | ToolMessage;

export type ChatHistory = ChatMessage[];
