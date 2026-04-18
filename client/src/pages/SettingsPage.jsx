import { useEffect, useState } from 'react';
import api from '../api/client';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SettingsPage() {
  const [form, setForm] = useState({
    businessPhone: '',
    businessEmail: '',
    reviewLink: '',
    defaultReminderHours: 24,
    defaultFollowupHours: 48,
    intakeFormSlug: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/settings').then((res) => {
      if (res.data.data.settings) setForm(res.data.data.settings);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await api.patch('/settings', form);
    setForm(res.data.data.settings);
    setMsg('Settings saved');
  };

  return (
    <Card>
      <h1 className="text-xl font-semibold">Business settings</h1>
      <form onSubmit={save} className="mt-4 grid gap-3 md:grid-cols-2">
        <Input label="Business phone" value={form.businessPhone || ''} onChange={(e) => setForm({ ...form, businessPhone: e.target.value })} />
        <Input label="Business email" value={form.businessEmail || ''} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} />
        <Input label="Review link" value={form.reviewLink || ''} onChange={(e) => setForm({ ...form, reviewLink: e.target.value })} />
        <Input label="Reminder hours" type="number" value={form.defaultReminderHours || 24} onChange={(e) => setForm({ ...form, defaultReminderHours: Number(e.target.value) })} />
        <Input label="Follow-up hours" type="number" value={form.defaultFollowupHours || 48} onChange={(e) => setForm({ ...form, defaultFollowupHours: Number(e.target.value) })} />
        <Input label="Intake form slug" value={form.intakeFormSlug || ''} onChange={(e) => setForm({ ...form, intakeFormSlug: e.target.value })} />
        <div className="md:col-span-2">
          <Button type="submit">Save</Button>
          {msg && <p className="mt-2 text-sm text-emerald-700">{msg}</p>}
        </div>
      </form>
    </Card>
  );
}
