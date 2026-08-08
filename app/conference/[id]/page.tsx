import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ConferenceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: conference } = await supabase
    .from('conferences')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!conference) notFound();

  return (
    <div className="glass-card p-8 max-w-3xl mx-auto">
      <span className="text-xs uppercase tracking-wide text-gold">{conference.department}</span>
      <h1 className="text-3xl font-bold text-white mt-2 mb-4">{conference.title}</h1>
      <p className="text-white/70 mb-6">{conference.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-white/60">
        {conference.start_date && <div>Start Date: {conference.start_date}</div>}
        {conference.submission_deadline && <div>Submission Deadline: {conference.submission_deadline}</div>}
        <div>Registration Fee: {conference.registration_fee}</div>
        <div>Status: {conference.status}</div>
      </div>

      <div className="flex gap-4 mb-6">
        {conference.brochure_url && (
          <a href={conference.brochure_url} target="_blank" className="outline-btn text-sm" rel="noreferrer">
            Download Brochure
          </a>
        )}
        {conference.flyer_url && (
          <a href={conference.flyer_url} target="_blank" className="outline-btn text-sm" rel="noreferrer">
            Download Flyer
          </a>
        )}
      </div>

      {conference.status !== 'past' && (
        <Link href={`/conference/${conference.id}/submit`} className="gold-btn inline-block">
          Submit Paper / Poster
        </Link>
      )}
    </div>
  );
}
