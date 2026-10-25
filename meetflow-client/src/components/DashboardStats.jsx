import { CalendarDays, ListTodo, CheckCircle2, Clock } from 'lucide-react';

export default function DashboardStats({ totalMeetings, totalTasks, completedTasks, pendingTasks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px', width: '100%' }}>
      
      <div className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ backgroundColor: 'rgba(0, 82, 204, 0.1)', color: '#0052cc', padding: '16px', borderRadius: '12px', display: 'flex' }}>
          <CalendarDays size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Toplam Toplantı</div>
          <div style={{ fontSize: '2em', fontWeight: '800', color: 'var(--text-title)' }}>{totalMeetings}</div>
        </div>
      </div>

      <div className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ backgroundColor: 'rgba(101, 84, 192, 0.1)', color: '#6554c0', padding: '16px', borderRadius: '12px', display: 'flex' }}>
          <ListTodo size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Toplam Görev</div>
          <div style={{ fontSize: '2em', fontWeight: '800', color: 'var(--text-title)' }}>{totalTasks}</div>
        </div>
      </div>

      <div className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ backgroundColor: 'rgba(54, 179, 126, 0.1)', color: '#36b37e', padding: '16px', borderRadius: '12px', display: 'flex' }}>
          <CheckCircle2 size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Tamamlanan</div>
          <div style={{ fontSize: '2em', fontWeight: '800', color: 'var(--text-title)' }}>{completedTasks}</div>
        </div>
      </div>

      <div className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ backgroundColor: 'rgba(255, 171, 0, 0.1)', color: '#ffab00', padding: '16px', borderRadius: '12px', display: 'flex' }}>
          <Clock size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Bekleyen Görev</div>
          <div style={{ fontSize: '2em', fontWeight: '800', color: 'var(--text-title)' }}>{pendingTasks}</div>
        </div>
      </div>

    </div>
  );
}