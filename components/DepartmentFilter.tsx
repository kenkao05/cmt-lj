'use client';

export default function DepartmentFilter({
  departments,
  selected,
  onChange
}: {
  departments: string[];
  selected: string;
  onChange: (dept: string) => void;
}) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="glass-card px-4 py-2 text-sm bg-transparent text-white outline-none"
    >
      <option value="" className="text-black">All Departments</option>
      {departments.map((d) => (
        <option key={d} value={d} className="text-black">{d}</option>
      ))}
    </select>
  );
}
