import { useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import client from '../api/client';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/appointments')
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Confirmed patient appointments</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <div className="empty-state-icon"><CalendarCheck size={32} /></div>
            No confirmed appointments yet.
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Service</th>
                <th>Scheduled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td style={{ fontWeight: 600 }}>{appt.patientName}</td>
                  <td>{appt.service}</td>
                  <td>{new Date(appt.scheduledAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}</td>
                  <td><StatusBadge status={appt.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}