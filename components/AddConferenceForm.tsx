'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AddConferenceForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<'past' | 'current' | 'upcoming'>('upcoming');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [registrationFee, setRegistrationFee] = useState('');
  const [paymentLinkUrl, setPaymentLinkUrl] = useState('');
  const [brochure, setBrochure] = useState<File | null>(null);
  const [flyer, setFlyer] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function uploadMaterial(file: File, label: string) {
    const path = `${Date.now()}-${label}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('conference-materials')
      .upload(path, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('conference-materials').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let brochureUrl = null;
      let flyerUrl = null;

      if (brochure) brochureUrl = await uploadMaterial(brochure, 'brochure');
      if (flyer) flyerUrl = await uploadMaterial(flyer, 'flyer');

      const { error: insertError } = await supabase.from('conferences').insert({
        title,
        department,
        status,
        description,
        start_date: startDate || null,
        submission_deadline: deadline || null,
        registration_fee: registrationFee || null,
        payment_link_url: paymentLinkUrl || null,
        brochure_url: brochureUrl,
        flyer_url: flyerUrl
      });

      if (insertError) throw insertError;

      // reset form
      setTitle(''); setDepartment(''); setStatus('upcoming'); setDescription('');
      setStartDate(''); setDeadline(''); setRegistrationFee(''); setPaymentLinkUrl('');
      setBrochure(null); setFlyer(null);

      onCreated();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6 mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Add Conference</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text" placeholder="Conference Title" required value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold md:col-span-2"
        />
        <input
          type="text" placeholder="Department (e.g. CSE)" required value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        />
        <select
          value={status} onChange={(e) => setStatus(e.target.value as any)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold"
        >
          <option value="upcoming" className="text-black">Upcoming</option>
          <option value="current" className="text-black">Current</option>
          <option value="past" className="text-black">Past</option>
        </select>
        <textarea
          placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold md:col-span-2"
          rows={3}
        />
        <div>
          <label className="text-xs text-white/50 block mb-1">Start Date</label>
          <input
            type="date" value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold w-full"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Submission Deadline</label>
          <input
            type="date" value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold w-full"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Registration Fee (e.g. ₹500)</label>
          <input
            type="text" placeholder="₹500 or 'Free'" value={registrationFee}
            onChange={(e) => setRegistrationFee(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold w-full"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Razorpay Payment Link (optional)</label>
          <input
            type="url" placeholder="https://rzp.io/l/xxxxxxx" value={paymentLinkUrl}
            onChange={(e) => setPaymentLinkUrl(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-gold w-full"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Brochure (PDF)</label>
          <input
            type="file" accept=".pdf"
            onChange={(e) => setBrochure(e.target.files?.[0] || null)}
            className="text-white/70 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Flyer (PDF/Image)</label>
          <input
            type="file" accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFlyer(e.target.files?.[0] || null)}
            className="text-white/70 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-400 md:col-span-2">{error}</p>}

        <button type="submit" disabled={loading} className="gold-btn md:col-span-2">
          {loading ? 'Creating...' : 'Create Conference'}
        </button>
      </form>
    </div>
  );
}