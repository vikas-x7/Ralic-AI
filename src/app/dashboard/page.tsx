import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/auth');
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
    redirect(`/dashboard/chat/${emptyChat.id}`);
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

  redirect(`/dashboard/chat/${chat.id}`);
}
