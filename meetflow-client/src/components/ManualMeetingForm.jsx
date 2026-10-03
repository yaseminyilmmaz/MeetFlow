export default function ManualMeetingForm({ handleSubmit, title, setTitle, date, setDate }) {
  return (
    <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #0052cc', minWidth: '350px' }}>
      <h3 style={{ marginTop: '0', color: 'var(--text-title)', fontSize: '1.2em', fontWeight: '600', marginBottom: '20px' }}>Manuel Toplantı Planla</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Toplantı Başlığı (Örn: Proje Sunumu)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '12px 16px', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '1em', outline: 'none', transition: '0.2s', backgroundColor: 'var(--bg-input)' }}
        />
        <input 
          type="datetime-local" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ padding: '12px 16px', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '1em', outline: 'none', transition: '0.2s', backgroundColor: 'var(--bg-input)' }}
        />
        <button className="btn-primary" type="submit" style={{ padding: '12px', backgroundColor: '#0065ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1em', fontWeight: '600', transition: '0.2s', marginTop: '5px' }}>
          Toplantıyı Oluştur
        </button>
      </form>
    </div>
  );
}