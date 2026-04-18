import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Button from '../components/Button';

const statuses = ['', 'new', 'quoted', 'booked', 'completed', 'archived'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({ q: '', status: '' });
  const [form, setForm] = useState({ customerName: '', serviceType: '', customerPhone: '', customerEmail: '' });

  const loadLeads = async () => {
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.status) params.status = filters.status;
    const res = await api.get('/leads', { params });
    setLeads(res.data.data.leads);
  };

  useEffect(() => {
    loadLeads();
  }, [filters.status]);

  const addLead = async (e) => {
    e.preventDefault();
    await api.post('/leads', form);
    setForm({ customerName: '', serviceType: '', customerPhone: '', customerEmail: '' });
    await loadLeads();
  };

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={addLead} className="grid gap-3 md:grid-cols-4">
          <Input label="Customer" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
          <Input label="Service" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} required />
          <Input label="Phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
          <Input label="Email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
          <div className="md:col-span-4"><Button type="submit">Create lead</Button></div>
        </form>
      </Card>

      <Card>
        <div className="mb-3 grid gap-3 md:grid-cols-[1fr,200px,auto]">
          <Input label="Search" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              {statuses.map((s) => <option key={s} value={s}>{s || 'all'}</option>)}
            </select>
          </label>
          <div className="self-end"><Button variant="secondary" onClick={loadLeads}>Apply</Button></div>
        </div>

        <div className="space-y-2">
          {leads.map((lead) => (
            <Link key={lead._id} to={`/app/leads/${lead._id}`} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
              <div>
                <p className="font-medium">{lead.customerName}</p>
                <p className="text-sm text-slate-600">{lead.serviceType}</p>
              </div>
              <Badge status={lead.status} />
            </Link>
          ))}
          {leads.length === 0 && <p className="text-sm text-slate-600">No leads found.</p>}
        </div>
      </Card>
    </div>
  );
}
