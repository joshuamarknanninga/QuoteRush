import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';

const statuses = ['new', 'quoted', 'booked', 'completed', 'archived'];

export default function LeadDetailPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState('');

  const load = async () => {
    const res = await api.get(`/leads/${id}`);
    setLead(res.data.data.lead);
  };

  useEffect(() => { load(); }, [id]);

  if (!lead) return <p>Loading...</p>;

  const updateField = async (updates) => {
    const res = await api.patch(`/leads/${id}`, updates);
    setLead(res.data.data.lead);
  };

  const submitNote = async (e) => {
    e.preventDefault();
    await api.post(`/leads/${id}/notes`, { body: note });
    setNote('');
    await load();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{lead.customerName}</h1>
          <Badge status={lead.status} />
        </div>
        <p className="text-sm text-slate-600">{lead.customerEmail || 'No email'} • {lead.customerPhone || 'No phone'}</p>
        <p className="mt-2 text-sm text-slate-600">{lead.address}</p>
        <p className="mt-2">{lead.message}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm">Status</span>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={lead.status} onChange={(e) => updateField({ status: e.target.value })}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <Input label="Quote amount" type="number" value={lead.quoteAmount} onChange={(e) => setLead({ ...lead, quoteAmount: e.target.value })} onBlur={() => updateField({ quoteAmount: Number(lead.quoteAmount) || 0 })} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Notes</h2>
        <form onSubmit={submitNote} className="mt-3 flex gap-2">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add note" required />
          <Button type="submit">Add</Button>
        </form>
        <div className="mt-3 space-y-2">
          {lead.notes.map((n) => (
            <div key={n._id} className="rounded-lg border border-slate-200 p-2">
              <p className="text-sm">{n.body}</p>
              <p className="text-xs text-slate-500">{n.authorName}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Communication history</h2>
        <div className="mt-3 space-y-2">
          {lead.communicationHistory.length === 0 && <p className="text-sm text-slate-600">No messages logged yet.</p>}
          {lead.communicationHistory.map((msg, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 p-2 text-sm">
              <p>{msg.body}</p>
              <p className="text-xs text-slate-500">{msg.channel} • {msg.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
