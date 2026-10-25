import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Sun, Moon, Menu } from 'lucide-react';

export default function MainLayout(props) {
  const { isDarkMode, setIsDarkMode } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={isDarkMode ? 'dark-mode' : ''} style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-body)', color: 'var(--text-normal)', overflow: 'hidden' }}>
      
      <Sidebar isOpen={isSidebarOpen} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', width: '100%', transition: 'all 0.3s ease' }}>
        
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 20 }}>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-title)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', transition: '0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #0052cc, #36b37e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: 'white', fontWeight: 'bold', fontSize: '1.2em', boxShadow: '0 4px 10px rgba(54, 179, 126, 0.3)' }}>
              M
            </div>
            <h1 style={{ 
              margin: 0, 
              fontWeight: '800', 
              fontSize: '1.6em', 
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #091e42 0%, #0052cc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2',
              paddingBottom: '2px'
            }}>
              MeetFlow
            </h1>
          </div>

          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', color: 'var(--text-normal)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </div>
        </header>

        <div style={{ padding: '40px', flex: 1 }}>
          <Outlet context={props} />
        </div>

      </main>
    </div>
  );
}