'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) setMessage(error.message);
    else setMessage('Check your email to verify your account before submitting a paper.');
  }

  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Author Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text" placeholder="Full Name" required value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
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
        <button type="submit" className="gold-btn">Sign Up</button>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </form>
    </div>
  );
}
