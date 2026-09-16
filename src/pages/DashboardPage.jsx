import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import client from '../api/client';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/dashboard')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Could not load dashboard data. Please try refreshing.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">Loading dashboard...</div>
      </Layout>
    );
  }

  if (error || !summary) {
    return (
      <Layout>
        <div className="error-banner" style={{ maxWidth: 480 }}>
          <AlertCircle size={16} />
          {error || 'Something went wrong loading the dashboard.'}
        </div>
      </Layout>
    );
  }

  const stats = [
    { label: 'Total Leads', value: summary.totalLeads, icon: Users, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Awaiting Confirmation', value: summary.awaitingConfirmationCount, icon: Clock, color: '#d97706', bg: '#fffbeb' },
    { label: 'Confirmed', value: summary.confirmedCount, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Dismissed', value: summary.dismissedCount, icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your patient leads and appointments</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card-icon" style={{ background: stat.bg, color: stat.color }}>
              <stat.icon size={18} />
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-padded">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Leads</h3>
          <Link to="/leads" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {(summary.recentLeads || []).length === 0 ? (
          <div className="empty-state">No leads yet. New patient conversations will appear here.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {summary.recentLeads.map((lead) => (
              <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.patientName || 'Unknown patient'}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{lead.serviceNeeded || '—'}</div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}