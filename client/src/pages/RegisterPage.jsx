import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', businessName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold">Create account</h1>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Register</Button>
          <p className="text-sm text-slate-600">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
        </form>
      </Card>
    </div>
  );
}
