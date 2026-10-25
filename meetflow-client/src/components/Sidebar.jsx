import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays } from 'lucide-react';

export default function Sidebar() {
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
    boxShadow: isActive ? '0 4px 12px rgba(0, 82, 204, 0.3)' : 'none'
  });

  return (
    <aside style={{ width: '280px', backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-light)', padding: '30px 20px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, zIndex: 10 }}>
      
      <div style={{ marginBottom: '50px', padding: '0 10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0052cc, #36b37e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: 'white', fontWeight: 'bold', fontSize: '1.2em', boxShadow: '0 4px 10px rgba(54, 179, 126, 0.3)' }}>
          M
        </div>
        <h1 style={{ 
          margin: 0, 
          fontWeight: '800', 
          fontSize: '1.8em', 
          letterSpacing: '-1px',
          background: 'linear-gradient(90deg, #091e42 0%, #0052cc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          MeetFlow
        </h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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

      <div style={{ padding: '20px 10px', fontSize: '0.85em', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-light)', fontWeight: '500' }}>
        © 2026 MeetFlow Inc.
      </div>
    </aside>
  );
}