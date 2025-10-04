import 'server-only';

const NVIDIA_CHAT_COMPLETIONS_URL =
  'https://integrate.api.nvidia.com/v1/chat/completions';
const STREAM_WORD_DELAY_MS = 32;

export const DEFAULT_NVIDIA_MODEL = 'google/gemma-2-2b-it';
export const NVIDIA_RESPONSE_TIMEOUT_MS = 120_000;

export type NvidiaChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type NvidiaChatDelta = {
  content?: string;
  reasoning?: string;
  reasoning_content?: string;
};

type NvidiaChatChunk = {
  choices?: Array<{
    delta?: NvidiaChatDelta;
  }>;
};

type NvidiaChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export function requireNvidiaApiKey() {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is missing in the environment.');
  }

  return apiKey;
}

function createRequestBody({
  messages,
  model,
  stream,
}: {
  messages: NvidiaChatMessage[];
  model: string;
  stream: boolean;
}) {
  return {
    model,
    messages,
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
    stream,
  };
}

export async function fetchNvidiaChatCompletion({
  apiKey,
  messages,
  model,
  signal,
}: {
  apiKey: string;
  messages: NvidiaChatMessage[];
  model: string;
  signal?: AbortSignal;
}) {
  const response = await fetch(NVIDIA_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createRequestBody({ messages, model, stream: false })),
    signal,
  });

  if (!response.ok) {
    throw new Error(await getNvidiaErrorMessage(response));
  }

  const completion = (await response.json()) as NvidiaChatCompletion;

  return completion.choices?.[0]?.message?.content?.trim() || '';
}

export async function fetchNvidiaChatStream({
  apiKey,
  messages,
  model,
  signal,
}: {
  apiKey: string;
  messages: NvidiaChatMessage[];
  model: string;
  signal?: AbortSignal;
}) {
  const response = await fetch(NVIDIA_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createRequestBody({ messages, model, stream: true })),
    signal,
  });

  if (!response.ok) {
    throw new Error(await getNvidiaErrorMessage(response));
  }

  if (!response.body) {
    throw new Error('NVIDIA response stream was empty.');
  }

  return response.body.pipeThrough(createNvidiaTextStream());
}

function createNvidiaTextStream() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new TransformStream<Uint8Array, Uint8Array>({
    async transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      buffer = await processNvidiaStreamBuffer(buffer, (text) =>
        enqueuePacedText(text, controller, encoder)
      );
    },
    async flush(controller) {
      buffer += decoder.decode();
      await processNvidiaStreamBuffer(`${buffer}\n\n`, (text) =>
        enqueuePacedText(text, controller, encoder)
      );
    },
  });
}

async function processNvidiaStreamBuffer(
  buffer: string,
  onText: (text: string) => Promise<void>
) {
  const events = buffer.split(/\r?\n\r?\n/);
  const remainder = events.pop() || '';

  for (const event of events) {
    for (const line of event.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;

      const data = line.slice(5).trim();

      if (!data || data === '[DONE]') continue;

      try {
        const chunk = JSON.parse(data) as NvidiaChatChunk;
        const text = chunk.choices?.[0]?.delta?.content;

        if (text) await onText(text);
      } catch {
        // Ignore malformed stream frames and continue with later chunks.
      }
    }
  }

  return remainder;
}

async function enqueuePacedText(
  text: string,
  controller: TransformStreamDefaultController<Uint8Array>,
  encoder: TextEncoder
) {
  const words = text.match(/\S+\s*|\s+/g) || [text];

  for (const word of words) {
    controller.enqueue(encoder.encode(word));
    await delay(STREAM_WORD_DELAY_MS);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getNvidiaErrorMessage(response: Response) {
  const fallback = `NVIDIA API request failed with status ${response.status}.`;
  const body = await response.text().catch(() => '');

  if (!body) return fallback;

  try {
    const parsed = JSON.parse(body) as {
      error?: {
        message?: string;
      };
    };

    return parsed.error?.message || fallback;
  } catch {
    return body;
  }
}
