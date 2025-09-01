import Link from 'next/link';

function LandingPage() {
  return (
    <>
      <div>home page </div>
      <Link href="/dashboard"> go to dashboard</Link>
    </>
  );
}

export default LandingPage;
