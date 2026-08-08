'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AddConferenceForm from '@/components/AddConferenceForm'; 


export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [conferences, setConferences] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: subs } = await supabase
      .from('submissions')
      .select('*, conferences(title)')
      .order('created_at', { ascending: false });
    setSubmissions(subs || []);

    const { data: confs } = await supabase.from('conferences').select('*');
    setConferences(confs || []);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('submissions').update({ status }).eq('id', id);
    loadData();
  }

  function downloadCSV() {
    const headers = ['Abstract ID', 'Author', 'Email', 'Title', 'Type', 'Conference', 'Status'];
    const rows = filtered.map((s) => [
      s.abstract_id, s.author_name, s.author_email, s.paper_title, s.type,
      s.conferences?.title || '', s.status
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
  }

  const filtered = submissions.filter((s) =>
    s.author_name.toLowerCase().includes(search.toLowerCase()) ||
    s.paper_title.toLowerCase().includes(search.toLowerCase()) ||
    s.abstract_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Dashboard</h1>
      <AddConferenceForm onCreated={loadData} />
      <div className="flex justify-between items-center mb-6">
        <input
          type="text" placeholder="Search by name, title, or abstract ID..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white w-80 outline-none focus:border-gold"
        />
        <button onClick={downloadCSV} className="outline-btn text-sm">Download CSV</button>
      </div>

      <div className="glass-card p-4 overflow-x-auto mb-10">
        <table className="w-full text-sm text-white/80">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="p-3">Abstract ID</th>
              <th className="p-3">Author</th>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Conference</th>
              <th className="p-3">File</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="p-3 text-gold">{s.abstract_id}</td>
                <td className="p-3">{s.author_name}</td>
                <td className="p-3">{s.paper_title}</td>
                <td className="p-3 capitalize">{s.type}</td>
                <td className="p-3">{s.conferences?.title}</td>
                <td className="p-3">
                  <a href={s.file_url} target="_blank" rel="noreferrer" className="text-gold underline">
                    View
                  </a>
                </td>
                <td className="p-3">
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1"
                  >
                    <option value="submitted" className="text-black">Submitted</option>
                    <option value="under_review" className="text-black">Under Review</option>
                    <option value="accepted" className="text-black">Accepted</option>
                    <option value="rejected" className="text-black">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Conference Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {conferences.map((c) => (
          <div key={c.id} className="glass-card p-4 flex flex-col gap-2">
            <span className="text-white">{c.title}</span>
            <a
              href={`/api/report/${c.id}`}
              className="gold-btn text-center text-sm"
            >
              Download PDF Report
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
