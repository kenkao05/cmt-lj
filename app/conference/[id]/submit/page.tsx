'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function SubmitPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [type, setType] = useState<'paper' | 'poster'>('paper');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [abstractId, setAbstractId] = useState('');
  const [loading, setLoading] = useState(false);

  function validateFile(f: File) {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return 'Only PDF, PNG, or JPG files are allowed.';
    }
    if (f.size > MAX_SIZE) {
      return 'File must be under 10MB.';
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!file) { setError('Please attach a file.'); return; }
    const fileError = validateFile(file);
    if (fileError) { setError(fileError); return; }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('You must be logged in.'); setLoading(false); return; }

    const fileExt = file.name.split('.').pop();
    const filePath = `${params.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(filePath, file);

    if (uploadError) { setError(uploadError.message); setLoading(false); return; }

    const { data: urlData } = supabase.storage.from('submissions').getPublicUrl(filePath);

    const generatedAbstractId = 'ABS-' + Math.floor(10000 + Math.random() * 90000);

    const { error: insertError } = await supabase.from('submissions').insert({
      abstract_id: generatedAbstractId,
      conference_id: params.id,
      author_id: user.id,
      author_name: authorName,
      author_email: authorEmail,
      paper_title: paperTitle,
      type,
      file_url: urlData.publicUrl,
      file_type: file.type
    });

    setLoading(false);

    if (insertError) { setError(insertError.message); return; }

    setAbstractId(generatedAbstractId);
  }

  if (abstractId) {
    return (
      <div className="glass-card p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-semibold text-white mb-4">Submission Successful</h1>
        <p className="text-white/70 mb-2">Your Abstract ID is:</p>
        <p className="text-3xl font-bold text-gold mb-6">{abstractId}</p>
        <button onClick={() => router.push('/')} className="gold-btn">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Submit Paper / Poster</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text" placeholder="Author Name" required value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <input
          type="email" placeholder="Author Email" required value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <input
          type="text" placeholder="Paper / Poster Title" required value={paperTitle}
          onChange={(e) => setPaperTitle(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <select
          value={type} onChange={(e) => setType(e.target.value as 'paper' | 'poster')}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        >
          <option value="paper" className="text-black">Paper Presentation</option>
          <option value="poster" className="text-black">Poster Presentation</option>
        </select>
        <input
          type="file" accept=".pdf,.png,.jpg,.jpeg" required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-white/70 text-sm"
        />
        <p className="text-xs text-white/40">PDF, PNG, or JPG only. Max 10MB.</p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="gold-btn">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
