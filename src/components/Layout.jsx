import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, LogOut, Stethoscope } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Layout({ children }) {
  const { logout, clinicName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Stethoscope size={20} />
            </div>
            <span className="sidebar-logo-text">DentalBot</span>
          </div>
          <div className="sidebar-clinic-name">{clinicName || 'Clinic Dashboard'}</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            Leads
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={18} />
            Appointments
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}