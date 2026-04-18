import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/client';

export default function PublicQuoteRequestPage() {
  const { slug } = useParams();
  const [settings, setSettings] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '', address: '', serviceType: '', preferredDate: '', message: '', images: []
  });

  useEffect(() => {
    api.get(`/public/settings/${slug}`).then((res) => setSettings(res.data.data.settings));
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post(`/public/quote/${slug}`, form);
    setSubmitted(true);
  };

  if (!settings) return <div className="p-6">Loading intake form...</div>;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <h1 className="text-2xl font-semibold">{settings.businessName} Quote Request</h1>
        <p className="text-sm text-slate-600">Tell us about your project.</p>
        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
          <Input label="Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
          <Input label="Phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
          <Input label="Email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Service type" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} required />
          <Input label="Preferred date" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
          <label className="md:col-span-2 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Message</span>
            <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </label>
          <div className="md:col-span-2"><Button type="submit">Submit request</Button></div>
          {submitted && <p className="md:col-span-2 text-sm text-emerald-700">Thanks, we received your request.</p>}
        </form>
      </Card>
    </div>
  );
}
