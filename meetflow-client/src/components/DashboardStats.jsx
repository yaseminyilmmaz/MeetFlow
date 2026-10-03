export default function DashboardStats({ totalMeetings, totalTasks, completedTasks, pendingTasks }) {
  return (
    <div className="hide-item show-item" style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap', width: '100%' }}>
      <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #0052cc', minWidth: '200px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85em', textTransform: 'uppercase' }}>Toplam Toplantı</h4>
        <span style={{ fontSize: '2em', fontWeight: '700', color: 'var(--text-title)' }}>{totalMeetings}</span>
      </div>
      <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #6554c0', minWidth: '200px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85em', textTransform: 'uppercase' }}>Toplam Görev</h4>
        <span style={{ fontSize: '2em', fontWeight: '700', color: 'var(--text-title)' }}>{totalTasks}</span>
      </div>
      <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #36b37e', minWidth: '200px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85em', textTransform: 'uppercase' }}>Tamamlanan</h4>
        <span style={{ fontSize: '2em', fontWeight: '700', color: 'var(--text-title)' }}>{completedTasks}</span>
      </div>
      <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #ff5630', minWidth: '200px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85em', textTransform: 'uppercase' }}>Bekleyen Görev</h4>
        <span style={{ fontSize: '2em', fontWeight: '700', color: 'var(--text-title)' }}>{pendingTasks}</span>
      </div>
    </div>
  );
}