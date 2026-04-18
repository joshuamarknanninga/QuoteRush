import { Link, NavLink, Outlet } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/leads', label: 'Leads' },
  { to: '/app/settings', label: 'Settings' }
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/app/dashboard" className="text-lg font-semibold text-slate-900">QuoteRush</Link>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-slate-600 sm:block">{user?.businessName}</p>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-[200px,1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
