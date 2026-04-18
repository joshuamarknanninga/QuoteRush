import { useEffect, useState } from 'react';
import api from '../api/client';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function DashboardPage() {
  const [data, setData] = useState({ metrics: { new: 0, quoted: 0, booked: 0, completed: 0 }, recentLeads: [] });

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(data.metrics).map(([key, value]) => (
          <Card key={key}><p className="text-sm capitalize text-slate-600">{key}</p><p className="text-2xl font-semibold">{value}</p></Card>
        ))}
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Recent leads</h2>
        {data.recentLeads.length === 0 ? <p className="text-sm text-slate-600">No leads yet.</p> : (
          <div className="space-y-2">
            {data.recentLeads.map((lead) => (
              <div key={lead._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="font-medium">{lead.customerName}</p>
                  <p className="text-sm text-slate-600">{lead.serviceType}</p>
                </div>
                <Badge status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
