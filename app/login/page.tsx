'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const unverified = searchParams.get('unverified');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push('/');
  }

  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Author Login</h1>
      {unverified && (
        <p className="text-sm text-goldLight mb-4">
          Please verify your email before submitting a paper.
        </p>
      )}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email" placeholder="Email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <input
          type="password" placeholder="Password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <button type="submit" className="gold-btn">Log In</button>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </form>
      <p className="text-sm text-white/50 mt-4">
        No account? <Link href="/signup" className="text-gold">Sign up</Link>
      </p>
    </div>
  );
}
