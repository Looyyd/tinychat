import { OpenAIChatModel } from '../src/OpenAIChatModel';
import { ChatMessage, ChatHistory, AssistantMessage } from '../src/Message';

describe('OpenAIChatModel', () => {
  let chatModel: OpenAIChatModel;

  beforeAll(() => {
    chatModel = new OpenAIChatModel('gpt-3.5-turbo');
  });

  test('should return an assistant answer without errors', async () => {
    const messages: ChatHistory = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Hello! How are you?',
      },
    ];

    const response = await chatModel.call(messages);
    const assistantMessage: AssistantMessage = response.answer;

    expect(response.answer).toBeDefined();
    expect(assistantMessage.role).toBe('assistant');
    expect(assistantMessage.content).toBeDefined();
    expect(typeof response.answer.content).toBe('string');
    if (assistantMessage.content) {
      expect(assistantMessage.content.length).toBeGreaterThan(0);
    }
  });
});
