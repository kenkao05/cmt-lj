'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/admin');
  }

  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email" placeholder="Admin Email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <input
          type="password" placeholder="Password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <button type="submit" className="gold-btn">Log In</button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
