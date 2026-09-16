import { useEffect, useState } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import client from '../api/client';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingLead, setConfirmingLead] = useState(null);
  const [formData, setFormData] = useState({ patientName: '', service: '', scheduledAt: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = () => {
    setLoading(true);
    client.get('/leads')
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLeads, []);

  const openConfirmModal = (lead) => {
    setConfirmingLead(lead);
    setFormError('');
    setFormData({
      patientName: lead.patientName || '',
      service: lead.serviceNeeded || '',
      scheduledAt: '',
    });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.patientName.trim() || !formData.service.trim() || !formData.scheduledAt) {
      setFormError('All fields are required.');
      return;
    }

    const scheduledDate = new Date(formData.scheduledAt);
    if (scheduledDate <= new Date()) {
      setFormError('Appointment time must be in the future.');
      return;
    }

    setSubmitting(true);
    try {
      const isoValue = formData.scheduledAt.length === 16
        ? `${formData.scheduledAt}:00`
        : formData.scheduledAt;

      await client.post(`/leads/${confirmingLead.id}/confirm`, {
        patientName: formData.patientName.trim(),
        service: formData.service.trim(),
        scheduledAt: isoValue,
      });

      setConfirmingLead(null);
      fetchLeads();
    } catch (err) {
      const message = err.response?.data?.message || 'Could not confirm this lead. Please check the details and try again.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = async (id) => {
  if (!window.confirm('Are you sure you want to dismiss this lead? This cannot be undone.')) {
    return;
  }
  try {
    await client.post(`/leads/${id}/dismiss`);
    fetchLeads();
  } catch (err) {
    alert(err.response?.data?.message || 'Could not dismiss this lead.');
  }
};

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Patient inquiries captured through WhatsApp</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <div className="empty-state-icon"><Users size={32} /></div>
            No leads yet. When a patient messages your clinic on WhatsApp, they'll show up here.
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Preferred Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 600 }}>{lead.patientName || '—'}</td>
                  <td>{lead.patientPhone}</td>
                  <td>{lead.serviceNeeded || '—'}</td>
                  <td>{lead.preferredTimeText || '—'}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td>
                    {lead.status === 'AWAITING_CONFIRMATION' ? (
                      <div className="actions-cell">
                        <button className="btn btn-primary btn-sm" onClick={() => openConfirmModal(lead)}>
                          Confirm
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDismiss(lead.id)}>
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-faint)', fontSize: 13 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmingLead && (
        <Modal title="Confirm Appointment" onClose={() => setConfirmingLead(null)}>
          <form className="modal-form" onSubmit={handleConfirm}>
            {formError && (
              <div className="error-banner">
                <AlertCircle size={16} />
                {formError}
              </div>
            )}

            <div className="field">
              <label>Patient Name</label>
              <input
                className="input"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Service</label>
              <input
                className="input"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Scheduled Date & Time</label>
              <input
                className="input"
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmingLead(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}