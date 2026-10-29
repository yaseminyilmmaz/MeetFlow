import { useOutletContext } from 'react-router-dom';
import ManualMeetingForm from '../components/ManualMeetingForm';
import AudioAnalyzer from '../components/AudioAnalyzer';
import MeetingList from '../components/MeetingList';

export default function MeetingsPage() {
  const contextData = useOutletContext(); 

  return (
    <div className="hide-item show-item">
      <h2 style={{ color: 'var(--text-title)', margin: '0 0 25px 0', fontSize: '1.8em', fontWeight: '800' }}>Toplantılar ve Görevler</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', width: '100%', marginBottom: '50px' }}>
        <ManualMeetingForm handleSubmit={contextData.handleSubmit} title={contextData.title} setTitle={contextData.setTitle} date={contextData.date} setDate={contextData.setDate} />
        <AudioAnalyzer handleAudioUpload={contextData.handleAudioUpload} audioFile={contextData.audioFile} setAudioFile={contextData.setAudioFile} isAnalyzing={contextData.isAnalyzing} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
        <h3 style={{ color: 'var(--text-title)', margin: 0, fontSize: '1.2em', fontWeight: '700' }}>Kayıtlı Toplantılar</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Toplantı Ara..." value={contextData.searchTerm} onChange={(e) => contextData.setSearchTerm(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '20px', outline: 'none', backgroundColor: 'var(--bg-card)', fontSize: '0.9em', minWidth: '200px' }} />
          <select 
            value={contextData.filterUserId} 
            onChange={(e) => contextData.setFilterUserId(e.target.value)} 
            style={{ 
              padding: '8px 40px 8px 16px', 
              border: '1px solid var(--border-light)', 
              borderRadius: '20px', 
              outline: 'none', 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-normal)',
              cursor: 'pointer', 
              fontSize: '0.9em', 
              fontWeight: '600',
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
          >
            <option value="">Tüm Kullanıcıları Göster</option>
            {contextData.users.map(user => (
              <option key={user.id} value={user.id}>{user.fullName} Görevleri</option>
            ))}
          </select>
        </div>
      </div>

      <MeetingList {...contextData} />

    </div>
  );
}