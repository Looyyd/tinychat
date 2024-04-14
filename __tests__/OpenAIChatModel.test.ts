import { OpenAIChatModel } from '../src/OpenAIChatModel';
import { ChatMessage } from '../src/ChatMessage';

describe('OpenAIChatModel', () => {
  let chatModel: OpenAIChatModel;

  beforeAll(() => {
    chatModel = new OpenAIChatModel('gpt-3.5-turbo');
  });

  test('should return an assistant answer without errors', async () => {
    const messages: ChatMessage[] = [
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

    expect(response.answer).toBeDefined();
    expect(response.answer.role).toBe('assistant');
    expect(response.answer.content).toBeDefined();
    expect(typeof response.answer.content).toBe('string');
    expect(response.answer.content.length).toBeGreaterThan(0);
  });
});
