import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

export default async function ChatPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/login');
  }

  const emptyChat = await db.chat.findFirst({
    where: {
      userId,
      messages: {
        none: {},
      },
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
    },
  });

  if (emptyChat) {
    redirect(`/chat/${emptyChat.id}`);
  }

  const chat = await db.chat.create({
    data: {
      title: 'New Chat',
      userId,
    },
    select: {
      id: true,
    },
  });

  redirect(`/chat/${chat.id}`);
}
