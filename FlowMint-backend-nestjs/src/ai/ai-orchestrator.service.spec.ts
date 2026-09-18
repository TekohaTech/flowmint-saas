import { AiOrchestratorService } from './ai-orchestrator.service';

interface MockProvider {
  name: string;
  isConfigured: boolean;
  chat: jest.Mock;
  chatStream: jest.Mock;
}

function failingProvider(name: string, error: Error = new Error(`${name} exploded`)): MockProvider {
  return {
    name,
    isConfigured: true,
    chat: jest.fn().mockRejectedValue(error),
    chatStream: jest.fn().mockImplementation(async function* () {
      throw error;
    }),
  };
}

function workingProvider(name: string, chunks: string[] = ['respuesta-de-' + name]): MockProvider {
  return {
    name,
    isConfigured: true,
    chat: jest.fn().mockResolvedValue('respuesta-de-' + name),
    chatStream: jest.fn().mockImplementation(async function* () {
      for (const chunk of chunks) {
        yield chunk;
      }
    }),
  };
}

function createOrchestrator(groq: MockProvider, cerebras: MockProvider) {
  const svc = new AiOrchestratorService(groq as any, cerebras as any);
  svc.onModuleInit();
  return svc;
}

const messages = [{ role: 'user', content: 'hola' }];

describe('AiOrchestratorService — provider fallback', () => {
  it('uses Groq (first provider) when it works', async () => {
    const groq = workingProvider('groq');
    const cerebras = workingProvider('cerebras');
    const svc = createOrchestrator(groq, cerebras);

    const response = await svc.chat(messages);

    expect(response).toBe('respuesta-de-groq');
    expect(groq.chat).toHaveBeenCalledTimes(1);
    expect(cerebras.chat).not.toHaveBeenCalled();
  });

  it('falls back to Cerebras when Groq fails (the expired-key case)', async () => {
    const groq = failingProvider('groq', new Error('401 invalid api key'));
    const cerebras = workingProvider('cerebras');
    const svc = createOrchestrator(groq, cerebras);

    const response = await svc.chat(messages);

    expect(response).toBe('respuesta-de-cerebras');
    expect(groq.chat).toHaveBeenCalledTimes(1);
    expect(cerebras.chat).toHaveBeenCalledTimes(1);
  });

  it('throws the last error when every provider fails', async () => {
    const groq = failingProvider('groq', new Error('groq boom'));
    const cerebras = failingProvider('cerebras', new Error('cerebras boom'));
    const svc = createOrchestrator(groq, cerebras);

    await expect(svc.chat(messages)).rejects.toThrow('cerebras boom');
  });

  it('throws not-found when an explicit provider name does not exist', async () => {
    const groq = workingProvider('groq');
    const cerebras = workingProvider('cerebras');
    const svc = createOrchestrator(groq, cerebras);

    await expect(svc.chat(messages, 'openai')).rejects.toThrow('Provider openai not found');
  });

  it('streams from Groq when it works', async () => {
    const groq = workingProvider('groq', ['hola ', 'mundo [DONE]']);
    const cerebras = workingProvider('cerebras', ['x']);
    const svc = createOrchestrator(groq, cerebras);

    const chunks: string[] = [];
    for await (const chunk of svc.chatStream(messages)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['hola ', 'mundo [DONE]']);
    expect(cerebras.chatStream).not.toHaveBeenCalled();
  });

  it('streams from Cerebras when Groq fails to start the stream', async () => {
    const groq = failingProvider('groq', new Error('401 invalid api key'));
    const cerebras = workingProvider('cerebras', ['a ', 'b ', '[DONE]']);
    const svc = createOrchestrator(groq, cerebras);

    const chunks: string[] = [];
    for await (const chunk of svc.chatStream(messages)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['a ', 'b ', '[DONE]']);
    expect(cerebras.chatStream).toHaveBeenCalledTimes(1);
  });

  it('throws when all providers fail to stream', async () => {
    const groq = failingProvider('groq', new Error('groq boom'));
    const cerebras = failingProvider('cerebras', new Error('cerebras boom'));
    const svc = createOrchestrator(groq, cerebras);

    const collect = async () => {
      const chunks: string[] = [];
      for await (const chunk of svc.chatStream(messages)) {
        chunks.push(chunk);
      }
      return chunks;
    };

    await expect(collect()).rejects.toThrow('cerebras boom');
  });
});