import OpenAI from 'openai';
import { ChatModel, ChatResponse } from './ChatModel';
import { ChatHistory, AssistantMessage } from './Message';

export class OpenAIChatModel implements ChatModel {
  private readonly openai: OpenAI;
  modelName: string;

  constructor(modelName: string = 'gpt-3.5-turbo', apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key not provided');
    }
    this.modelName = modelName;
    this.openai = new OpenAI({ apiKey: key });
  }

  async call(messages: ChatHistory): Promise<ChatResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: messages,
      });

      const assistantMessage: AssistantMessage = {
        role: 'assistant',
        content: response.choices[0].message.content ?? '',
      };

      const history: ChatHistory = [...messages, assistantMessage];
      const rawResponse: unknown = response;

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
