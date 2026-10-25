import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout(props) {
  const { isDarkMode, setIsDarkMode } = props;

  return (
    <div className={isDarkMode ? 'dark-mode' : ''} style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-body)', color: 'var(--text-normal)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
          <div 
            className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`} 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
          >
            <div className="toggle-thumb">
                {isDarkMode ? '🌙' : '☀️'}
            </div>
          </div>
        </div>

        <Outlet context={props} />

      </main>
    </div>
  );
}