import { ChatMessage, ChatHistory, AssistantMessage } from './Message';

export interface ChatModel {
  call(messages: ChatHistory): Promise<ChatResponse>;
}

export interface ChatResponse {
  history: ChatHistory;
  answer: AssistantMessage;
  httpResponse: unknown;
}
