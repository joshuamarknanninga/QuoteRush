const colors = {
  new: 'bg-sky-100 text-sky-800',
  quoted: 'bg-amber-100 text-amber-800',
  booked: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-slate-200 text-slate-700'
};

export default function Badge({ status }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] || colors.archived}`}>{status}</span>;
}
