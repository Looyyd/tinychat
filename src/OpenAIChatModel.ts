import axios from 'axios';
import { ChatModel, ChatResponse } from './ChatModel';
import { ChatHistory, AssistantMessage } from './Message';

export class OpenAIChatModel implements ChatModel {
  private readonly apiKey: string;
  modelName: string;
  private readonly baseUrl: string;
  private readonly chatEndpoint: string = '/chat/completions';

  constructor(modelName: string = 'gpt-3.5-turbo', options?: { baseUrl?: string; apiKey?: string }) {
    if (options?.apiKey) {
      this.apiKey = options.apiKey;
    } else if (process.env.OPENAI_API_KEY) {
      this.apiKey = process.env.OPENAI_API_KEY;
    } else {
      throw new Error('OpenAI API key not provided');
    }
    this.modelName = modelName;
    this.baseUrl = options?.baseUrl || 'https://api.openai.com/v1';
  }

  async call(messages: ChatHistory): Promise<ChatResponse> {
    const chatUrl = `${this.baseUrl}${this.chatEndpoint}`;
    try {
      const response = await axios.post(
        chatUrl,
        {
          model: this.modelName,
          messages: messages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const assistantMessage: AssistantMessage = response.data.choices[0].message;
      const history: ChatHistory = [...messages, assistantMessage];
      const rawResponse: unknown = response.data;

      return {
        history,
        answer: assistantMessage,
        rawResponse,
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}
