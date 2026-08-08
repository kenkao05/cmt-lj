'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setEmail(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-white">
        CMT <span className="text-gold">| IEEE LJU</span>
      </Link>
      <nav className="flex gap-6 items-center text-sm">
        <Link href="/" className="hover:text-gold">Home</Link>
        <Link href="/upcoming" className="hover:text-gold">Upcoming</Link>
        <Link href="/past" className="hover:text-gold">Past</Link>
        {!email && <Link href="/login" className="hover:text-gold">Author Login</Link>}
        {!email && <Link href="/admin/login" className="outline-btn text-xs">Admin</Link>}
        {email && (
          <>
            <span className="text-xs text-gray-500">Logged in as {email}</span>
            <button onClick={handleLogout} className="outline-btn text-xs">
              Log Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}