import { Link } from 'react-router-dom';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', businessType: '' });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <section className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-indigo-50 via-sky-50 to-white px-6 py-14 shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Quote requests to booked jobs, fast.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">QuoteRush helps local service businesses capture leads, follow up, and stay organized.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/register"><Button>Start free</Button></Link>
          <Link to="/login"><Button variant="secondary">Login</Button></Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 md:grid-cols-3">
        {['Capture leads', 'Track pipeline', 'Automate reminders'].map((f) => (
          <Card key={f}><h3 className="font-semibold text-slate-800">{f}</h3><p className="mt-2 text-sm text-slate-600">Clean workflows for owner-operators.</p></Card>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <Card>
          <h2 className="text-xl font-semibold">Simple pricing</h2>
          <p className="mt-2 text-slate-600">$29/month per business. Everything in the MVP included.</p>
        </Card>
      </section>

      <section className="mx-auto max-w-xl px-4 pb-16">
        <Card>
          <h2 className="text-xl font-semibold">Request a demo</h2>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Business type" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} required />
            <Button type="submit">Submit</Button>
            {submitted && <p className="text-sm text-emerald-700">Thanks! We will reach out soon.</p>}
          </form>
        </Card>
      </section>
    </div>
  );
}
