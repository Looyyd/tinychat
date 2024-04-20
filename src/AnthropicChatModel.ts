import Anthropic from '@anthropic-ai/sdk';
import { ChatModel, ChatResponse } from './ChatModel';
import { ChatHistory, AssistantMessage, UserMessage } from './Message';

export class AnthropicChatModel implements ChatModel {
  private readonly apiKey: string;
  modelName: string;
  private anthropic: Anthropic;

  constructor(modelName: string = 'claude-3-haiku-20240307', apiKey?: string) {
    const inputKey = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!inputKey) {
      throw new Error('Anthropic API key not provided');
    } else {
      this.apiKey = inputKey;
    }
    this.modelName = modelName;
    this.anthropic = new Anthropic({ apiKey: this.apiKey });
  }

  async call(messages: ChatHistory): Promise<ChatResponse> {
    try {
      const filteredMessages: (AssistantMessage | UserMessage)[] = messages.filter(
        (msg): msg is AssistantMessage | UserMessage => msg.role !== 'system' && msg.role !== 'tool',
      );
      const systemMessage = messages.find((msg) => msg.role === 'system')?.content;

      const response = await this.anthropic.messages.create({
        model: this.modelName,
        max_tokens: 1024,
        messages: filteredMessages,
        system: systemMessage,
      });

      const assistantMessage: AssistantMessage = {
        role: 'assistant',
        content: response.content[0].text,
      };

      const history: ChatHistory = [...messages, assistantMessage];
      const rawResponse: unknown = response;

      return {
        history,
        answer: assistantMessage,
        rawResponse,
      };
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      throw error;
    }
  }
}
