import { ChatMessage } from './ChatMessage';

export interface ChatModel {
  call(messages: ChatMessage[]): Promise<ChatResponse>;
}

export interface ChatResponse {
  history: ChatMessage[];
  answer: ChatMessage;
  httpResponse: unknown;
}
