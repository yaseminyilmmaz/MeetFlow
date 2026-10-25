import { useOutletContext, useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import { Calendar, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { meetings } = useOutletContext();
  const navigate = useNavigate();

  const totalMeetings = meetings.length;
  const totalTasks = meetings.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
  const completedTasks = meetings.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.filter(t => (t.status || t.Status) === "Tamamlandı").length : 0), 0);
  const pendingTasks = totalTasks - completedTasks;

  const upcomingMeetings = [...meetings]
    .filter(m => new Date(m.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="hide-item show-item">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: 'var(--text-title)', margin: '0 0 10px 0', fontSize: '2.2em', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Hoş Geldin! 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1em', margin: 0 }}>
          Sistemde şu an tamamlanmayı bekleyen <strong style={{ color: '#ffab00' }}>{pendingTasks}</strong> aktif görev bulunuyor.
        </p>
      </div>

      <DashboardStats 
        totalMeetings={totalMeetings} 
        totalTasks={totalTasks} 
        completedTasks={completedTasks} 
        pendingTasks={pendingTasks} 
      />

      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ margin: 0, color: 'var(--text-title)', fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={22} color="#0052cc" /> Yaklaşan Toplantılar
          </h3>
          <button onClick={() => navigate('/meetings')} style={{ background: 'none', border: 'none', color: '#0052cc', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.95em', padding: 0 }}>
            Tümünü Gör <ArrowRight size={18} />
          </button>
        </div>

        {upcomingMeetings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', display: 'flex', flexDirection: 'column', gap: '10px', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#0052cc'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                <strong style={{ fontSize: '1.1em', color: 'var(--text-title)' }}>{meeting.title}</strong>
                <span style={{ fontSize: '0.9em', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {new Date(meeting.date).toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)', borderRadius: '12px', border: '1px dashed var(--border-light)' }}>
            Yaklaşan yeni bir toplantı bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}