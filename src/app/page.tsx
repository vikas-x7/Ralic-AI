import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import LandingPage from '@/client/markating/LandingPage';

export default async function Home() {
  const session = await auth();

  if (session?.user?.id) {
    redirect('/chat');
  }

  return (
    <>
      <div>
        <LandingPage />
      </div>
    </>
  );
}
