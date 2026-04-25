import { useEffect, useState } from 'react';
import api from '../api/client';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    businessPhone: '',
    businessEmail: '',
    reviewLink: '',
    defaultReminderHours: 24,
    defaultFollowupHours: 48,
    intakeFormSlug: ''
  });
  const [msg, setMsg] = useState('');
  const [billingMsg, setBillingMsg] = useState('');
  const [billingLoading, setBillingLoading] = useState(false);

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

  const startCheckout = async () => {
    setBillingMsg('');
    setBillingLoading(true);
    try {
      const res = await api.post('/billing/checkout-session');
      const url = res.data?.data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        setBillingMsg('Unable to start checkout session.');
      }
    } catch (_err) {
      setBillingMsg('Unable to start checkout session.');
    } finally {
      setBillingLoading(false);
    }
  };

  const openPortal = async () => {
    setBillingMsg('');
    setBillingLoading(true);
    try {
      const res = await api.post('/billing/portal-session');
      const url = res.data?.data?.portalUrl;
      if (url) {
        window.location.href = url;
      } else {
        setBillingMsg('Unable to open billing portal.');
      }
    } catch (_err) {
      setBillingMsg('Unable to open billing portal.');
    } finally {
      setBillingLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await refreshUser();
    setBillingMsg('Subscription status refreshed.');
  };

  return (
    <div className="space-y-4">
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

      <Card>
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="mt-1 text-sm text-slate-600">
          Subscription status: <span className="font-medium uppercase">{user?.subscriptionStatus || 'trialing'}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={startCheckout} disabled={billingLoading}>Start subscription</Button>
          <Button type="button" variant="secondary" onClick={openPortal} disabled={billingLoading}>Open billing portal</Button>
          <Button type="button" variant="secondary" onClick={refreshSubscription} disabled={billingLoading}>Refresh status</Button>
        </div>
        {billingMsg && <p className="mt-2 text-sm text-slate-600">{billingMsg}</p>}
      </Card>
    </div>
  );
}
