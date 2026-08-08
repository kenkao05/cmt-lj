import Link from 'next/link';

type Conference = {
  id: string;
  title: string;
  department: string;
  description: string | null;
  start_date: string | null;
  submission_deadline: string | null;
};

export default function ConferenceCard({ conference }: { conference: Conference }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-3">
      <span className="text-xs uppercase tracking-wide text-gold">{conference.department}</span>
      <h3 className="text-lg font-semibold text-white">{conference.title}</h3>
      {conference.description && (
        <p className="text-sm text-white/70 line-clamp-2">{conference.description}</p>
      )}
      <div className="text-xs text-white/50 flex gap-4">
        {conference.start_date && <span>Starts: {conference.start_date}</span>}
        {conference.submission_deadline && <span>Deadline: {conference.submission_deadline}</span>}
      </div>
      <Link href={`/conference/${conference.id}`} className="gold-btn text-center text-sm mt-2">
        View Details
      </Link>
    </div>
  );
}
