import OpenAI from 'openai';
import { ChatModel, ChatResponse, Tool } from './ChatModel';
import { ChatHistory, AssistantMessage } from './Message';

export interface OpenAIChatModelOptions {
  apiKey?: string;
  tools?: Tool[];
}
export interface CallOptions {
  tools?: Tool[];
}
export class OpenAIChatModel implements ChatModel {
  protected readonly openai: OpenAI;
  protected readonly tools: Tool[] | undefined;
  modelName: string;

  constructor(modelName: string = 'gpt-3.5-turbo', { apiKey, tools }: OpenAIChatModelOptions = {}) {
    const key = apiKey || process.env.OPENAI_API_KEY;

    if (!key) {
      throw new Error('OpenAI API key not provided');
    }

    this.modelName = modelName;
    this.openai = new OpenAI({ apiKey: key });
    this.tools = tools;
  }

  async call(messages: ChatHistory, options: CallOptions = {}): Promise<ChatResponse> {
    let allTools: Tool[] = [];
    if (options.tools) {
      allTools = [...options.tools];
    } else if (this.tools) {
      allTools = [...this.tools];
    } else {
      allTools = [];
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: messages,
        tools: allTools.map((tool) => tool.data),
      });

      const assistantMessage: AssistantMessage = {
        role: 'assistant',
        content: response.choices[0].message.content ?? '',
        tool_calls: response.choices[0].message.tool_calls,
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
