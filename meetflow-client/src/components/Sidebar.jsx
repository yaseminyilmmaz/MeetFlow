import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Menu } from 'lucide-react';

export default function Sidebar({ isOpen, setIsSidebarOpen }) {
  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: isOpen ? '14px 18px' : '14px 0',
    justifyContent: isOpen ? 'flex-start' : 'center',
    borderRadius: '12px',
    textDecoration: 'none',
    color: isActive ? '#fff' : 'var(--text-muted)',
    backgroundColor: isActive ? '#0052cc' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '8px',
    boxShadow: isActive ? '0 4px 12px rgba(0, 82, 204, 0.3)' : 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  });

  return (
    <aside style={{ 
      width: isOpen ? '280px' : '88px', 
      backgroundColor: 'var(--bg-card)', 
      borderRight: '1px solid var(--border-light)', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      position: 'sticky', 
      top: 0, 
      zIndex: 30,
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '20px 24px' : '20px 0', height: '80px' }}>
        <button 
          onClick={() => setIsSidebarOpen(!isOpen)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-title)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', transition: '0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Menu size={26} />
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: isOpen ? '10px 20px' : '10px 14px' }}>
        <NavLink to="/" style={navLinkStyle}>
          <LayoutDashboard size={22} style={{ minWidth: '22px', flexShrink: 0 }} />
          <span style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s', display: isOpen ? 'block' : 'none' }}>Dashboard</span>
        </NavLink>
        
        <NavLink to="/meetings" style={navLinkStyle}>
          <Calendar size={22} style={{ minWidth: '22px', flexShrink: 0 }} />
          <span style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s', display: isOpen ? 'block' : 'none' }}>Toplantılar & Görevler</span>
        </NavLink>

        <NavLink to="/users" style={navLinkStyle}>
          <Users size={22} style={{ minWidth: '22px', flexShrink: 0 }} />
          <span style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s', display: isOpen ? 'block' : 'none' }}>Kullanıcı Yönetimi</span>
        </NavLink>
      </nav>

      <div style={{ padding: '20px 10px', fontSize: '0.85em', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-light)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {isOpen ? '© 2026 MeetFlow Inc.' : '© 26'}
      </div>
    </aside>
  );
}