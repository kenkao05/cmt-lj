'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ConferenceCard from '@/components/ConferenceCard';
import DepartmentFilter from '@/components/DepartmentFilter';

export default function UpcomingPage() {
  const [conferences, setConferences] = useState<any[]>([]);
  const [dept, setDept] = useState('');
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('conferences')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true });
      setConferences(data || []);
    })();
  }, []);

  const departments = Array.from(new Set(conferences.map((c) => c.department)));
  const filtered = dept ? conferences.filter((c) => c.department === dept) : conferences;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Upcoming Conferences</h1>
        <DepartmentFilter departments={departments} selected={dept} onChange={setDept} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((c) => <ConferenceCard key={c.id} conference={c} />)}
      </div>
      {filtered.length === 0 && <p className="text-white/50">No upcoming conferences found.</p>}
    </div>
  );
}
