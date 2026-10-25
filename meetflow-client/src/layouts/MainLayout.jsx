import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Sun, Moon } from 'lucide-react';

export default function MainLayout(props) {
  const { isDarkMode, setIsDarkMode } = props;

  return (
    <div className={isDarkMode ? 'dark-mode' : ''} style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-body)', color: 'var(--text-normal)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', color: 'var(--text-normal)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
          </div>
        </div>

        <Outlet context={props} />

      </main>
    </div>
  );
}