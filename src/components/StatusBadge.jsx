const STATUS_CONFIG = {
  AWAITING_REPLY: { label: 'Awaiting Reply', color: '#64748b', bg: '#f1f5f9' },
  COLLECTING_DETAILS: { label: 'Collecting Details', color: '#2563eb', bg: '#eff6ff' },
  AWAITING_CONFIRMATION: { label: 'Awaiting Confirmation', color: '#d97706', bg: '#fffbeb' },
  CONFIRMED: { label: 'Confirmed', color: '#16a34a', bg: '#f0fdf4' },
  DISMISSED: { label: 'Dismissed', color: '#dc2626', bg: '#fef2f2' },
  COMPLETED: { label: 'Completed', color: '#16a34a', bg: '#f0fdf4' },
  CANCELLED: { label: 'Cancelled', color: '#dc2626', bg: '#fef2f2' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };

  return (
    <span className="badge" style={{ color: config.color, background: config.bg }}>
      <span className="badge-dot" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}