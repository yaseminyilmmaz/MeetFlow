import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays } from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: isActive ? '#fff' : 'var(--text-muted)',
    backgroundColor: isActive ? '#0052cc' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '8px',
    boxShadow: isActive ? '0 4px 12px rgba(0, 82, 204, 0.3)' : 'none',
    whiteSpace: 'nowrap'
  });

  return (
    <aside style={{ 
      width: isOpen ? '280px' : '0px', 
      opacity: isOpen ? 1 : 0,
      backgroundColor: 'var(--bg-card)', 
      borderRight: isOpen ? '1px solid var(--border-light)' : 'none', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      position: 'sticky', 
      top: 0, 
      zIndex: 10,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      
      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '30px 20px', minWidth: '280px', marginTop: '20px' }}>
        <NavLink to="/" style={navLinkStyle}>
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/meetings" style={navLinkStyle}>
          <CalendarDays size={22} />
          <span>Toplantılar & Görevler</span>
        </NavLink>

        <NavLink to="/users" style={navLinkStyle}>
          <Users size={22} />
          <span>Kullanıcı Yönetimi</span>
        </NavLink>
      </nav>

      <div style={{ padding: '20px 10px', fontSize: '0.85em', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-light)', fontWeight: '500', minWidth: '280px' }}>
        © 2026 MeetFlow Inc.
      </div>
    </aside>
  );
}