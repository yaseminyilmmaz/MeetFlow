import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays } from 'lucide-react';

export default function Sidebar() {
  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: isActive ? '#0052cc' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
    fontWeight: isActive ? '700' : '500',
    transition: 'all 0.2s ease',
    marginBottom: '8px'
  });

  return (
    <aside style={{ width: '260px', backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-light)', padding: '24px 16px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ marginBottom: '40px', padding: '0 10px' }}>
        <h1 style={{ margin: 0, color: 'var(--text-title)', fontWeight: '900', fontSize: '1.8em', letterSpacing: '-1px' }}>
          MeetFlow<span style={{ color: '#36b37e' }}>.</span>
        </h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <NavLink to="/" style={navLinkStyle}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/meetings" style={navLinkStyle}>
          <CalendarDays size={20} />
          <span>Toplantılar & Görevler</span>
        </NavLink>

        <NavLink to="/users" style={navLinkStyle}>
          <Users size={20} />
          <span>Kullanıcı Yönetimi</span>
        </NavLink>
      </nav>

      <div style={{ padding: '16px 10px', fontSize: '0.8em', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
        © 2026 MeetFlow
      </div>
    </aside>
  );
}