import 'server-only';
import MemoryClient, { type Memory } from 'mem0ai';
import type { NvidiaChatMessage } from './nvidia';

const MEMORY_SEARCH_LIMIT = 5;
const MEMORY_SOURCE = 'relic-ai-chat';

let memoryClient: MemoryClient | null = null;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function getMemoryUserId(user: {
  id?: string | null;
  email?: string | null;
}) {
  return user.id || user.email || null;
}

export async function withUserMemory({
  userId,
  messages,
}: {
  userId: string | null;
  messages: ChatMessage[];
}): Promise<NvidiaChatMessage[]> {
  if (!userId) return messages;

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user');

  if (!latestUserMessage) return messages;

  const memories = await searchUserMemories({
    userId,
    query: latestUserMessage.content,
  });

  if (!memories.length) return messages;

  const latestUserMessageIndex = findLatestUserMessageIndex(messages);

  if (latestUserMessageIndex === -1) return messages;

  return messages.map((message, index) => {
    if (index !== latestUserMessageIndex) return message;

    return {
      ...message,
      content: [
        'Relevant long-term memory context:',
        ...memories.map(
          (memory, memoryIndex) => `${memoryIndex + 1}. ${memory}`
        ),
        '',
        'Use the memory only if it is helpful. Do not mention it directly unless needed.',
        '',
        `User message: ${message.content}`,
      ].join('\n'),
    };
  });
}

export async function rememberConversation({
  userId,
  userMessage,
  assistantMessage,
}: {
  userId: string | null;
  userMessage: string;
  assistantMessage: string;
}) {
  const client = getMemoryClient();

  if (!client || !userId || !userMessage || !assistantMessage) return;

  try {
    await client.add(
      [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ],
      {
        userId,
        metadata: {
          source: MEMORY_SOURCE,
        },
      }
    );
  } catch (error) {
    logMemoryWarning('Failed to add Mem0 memory.', error);
  }
}

async function searchUserMemories({
  userId,
  query,
}: {
  userId: string;
  query: string;
}) {
  const client = getMemoryClient();

  if (!client) return [];

  try {
    const response = await client.search(query, {
      filters: {
        user_id: userId,
      },
      topK: MEMORY_SEARCH_LIMIT,
    });

    return response.results
      .map(getMemoryText)
      .filter((memory): memory is string => Boolean(memory));
  } catch (error) {
    logMemoryWarning('Failed to search Mem0 memories.', error);
    return [];
  }
}

function getMemoryClient() {
  const apiKey = process.env.MEM0_API_KEY;

  if (!apiKey) return null;

  memoryClient ??= new MemoryClient({ apiKey });

  return memoryClient;
}

function getMemoryText(memory: Memory) {
  return memory.memory || memory.data?.memory || '';
}

function findLatestUserMessageIndex(messages: ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'user') return index;
  }

  return -1;
}

function logMemoryWarning(message: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);

  console.warn(`${message} ${detail}`);
}
