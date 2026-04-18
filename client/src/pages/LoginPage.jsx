import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold">Login</h1>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
          <p className="text-sm text-slate-600">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
        </form>
      </Card>
    </div>
  );
}
