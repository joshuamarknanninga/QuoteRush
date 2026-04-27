import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [debugHint, setDebugHint] = useState('');
  const { login, startDemo } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/app/dashboard');
    } catch (err) {
      const status = err.response?.status;
      const apiMessage = err.response?.data?.message;
      setError(apiMessage || `Login failed${status ? ` (${status})` : ''}`);

      if (status === 403) {
        setDebugHint('403 usually means the frontend is not reaching your backend API. Check VITE_API_URL and your proxy/deploy config.');
      } else {
        setDebugHint('');
      }
    }
  };

  const useDemoCredentials = () => {
    setForm({ email: 'demo@quoterush.app', password: 'DemoPass123!' });
    setError('');
    setDebugHint('');
  };

  const startInstantDemo = async () => {
    setError('');
    setDebugHint('');
    try {
      await startDemo();
      navigate('/app/dashboard');
    } catch (err) {
      const status = err.response?.status;
      setError(err.response?.data?.message || `Unable to start demo${status ? ` (${status})` : ''}`);
    }
  };

  const useDemoCredentials = () => {
    setForm({ email: 'demo@quoterush.app', password: 'DemoPass123!' });
    setError('');
    setDebugHint('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-slate-600">Want to record a demo? Use the pre-seeded demo account.</p>
        <button
          type="button"
          onClick={startInstantDemo}
          className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Start instant demo
        </button>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {debugHint && <p className="text-sm text-amber-700">{debugHint}</p>}
          <button
            type="button"
            onClick={useDemoCredentials}
            className="text-sm font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
          >
            Fill demo credentials
          </button>
          <Button type="submit" className="w-full">Login</Button>
          <p className="text-sm text-slate-600">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
        </form>
      </Card>
    </div>
  );
}
