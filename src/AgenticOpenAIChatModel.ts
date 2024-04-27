import { OpenAIChatModel } from './OpenAIChatModel';
import { ChatHistory } from './Message';
import { ChatResponse } from './ChatModel';
import { Tool } from './Tool';

export interface AgenticCallOptions {
  tools?: Tool[];
  toolChoice?: 'auto' | 'user';
}

export class AgenticOpenAIChatModel extends OpenAIChatModel {
  async agenticCall(messages: ChatHistory, options: AgenticCallOptions = {}): Promise<ChatResponse> {
    const effectiveTools = options.tools || this.tools || [];
    const response = await this.call(messages, { tools: effectiveTools });
    messages = response.history;

    // Check if the response contains tool calls
    if (response.answer.tool_calls) {
      const toolCalls = response.answer.tool_calls;

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const toolArguments = JSON.parse(toolCall.function.arguments);

        // Find the corresponding tool function
        const tool = effectiveTools.find((t) => t.data.function.name === toolName);

        if (tool) {
          // Execute the tool function with the provided arguments
          const toolOutput = await tool.execute(toolArguments);

          // Append the tool output to the messages and make another call
          messages.push({ role: 'tool', content: toolOutput, tool_call_id: toolCall.id });
        }
      }
      return this.agenticCall(messages, options);
    }

    return response;
  }
}
