import { createClient } from '@/lib/supabase/server';
import ConferenceCard from '@/components/ConferenceCard';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = createClient();

  const { data: currentConferences } = await supabase
    .from('conferences')
    .select('*')
    .eq('status', 'current')
    .order('created_at', { ascending: false });

  const { data: upcomingConferences } = await supabase
    .from('conferences')
    .select('*')
    .eq('status', 'upcoming')
    .order('start_date', { ascending: true })
    .limit(3);

  return (
    <div>
      <div className="glass-card p-10 mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Conference Management Tool</h1>
        <p className="text-white/70">Lok Jagruti Kendra University — IEEE Student Branch</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-white">Current Conferences</h2>
      {(!currentConferences || currentConferences.length === 0) && (
        <p className="text-white/50 mb-10">No conferences currently in progress.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {currentConferences?.map((c) => <ConferenceCard key={c.id} conference={c} />)}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Upcoming Conferences</h2>
        <Link href="/upcoming" className="outline-btn text-sm">View All</Link>
      </div>
      {(!upcomingConferences || upcomingConferences.length === 0) && (
        <p className="text-white/50">No upcoming conferences yet.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingConferences?.map((c) => <ConferenceCard key={c.id} conference={c} />)}
      </div>
    </div>
  );
}