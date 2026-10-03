import { toast } from 'react-toastify';

export default function AudioAnalyzer({ handleAudioUpload, audioFile, setAudioFile, isAnalyzing }) {
  
  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Dosya boyutu çok büyük! Lütfen 25 MB'dan küçük bir kayıt seçin.");
      e.target.value = null;
      return;
    }

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'video/mp4'];
    const isValidExtension = file.name.endsWith('.mp3') || file.name.endsWith('.mp4') || file.name.endsWith('.wav');
    
    if (!validTypes.includes(file.type) && !isValidExtension) {
      toast.error("Geçersiz format! Sadece .mp3, .wav veya .mp4 yükleyebilirsiniz.");
      e.target.value = null;
      return;
    }

    setAudioFile(file);
  };

  return (
    <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #6554c0', minWidth: '350px' }}>
      <h3 style={{ marginTop: '0', color: 'var(--text-title)', fontSize: '1.2em', fontWeight: '600', marginBottom: '20px' }}>
        Yapay Zeka ile Ses Analizi
      </h3>
      <form onSubmit={handleAudioUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="file" 
          id="audio-upload"
          accept="audio/*, video/mp4"
          onChange={onFileSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor="audio-upload" className="file-upload-label">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          {audioFile ? audioFile.name : "Toplantı Kaydı Seç (.mp3, .mp4)"}
        </label>

        <button 
          type="submit" 
          disabled={isAnalyzing}
          style={{ padding: '12px', backgroundColor: isAnalyzing ? 'var(--text-muted)' : '#6554c0', color: 'white', border: 'none', borderRadius: '6px', cursor: isAnalyzing ? 'not-allowed' : 'pointer', fontSize: '1em', fontWeight: '600', transition: '0.2s', marginTop: '53px' }}>
          {isAnalyzing ? 'Analiz Ediliyor...' : 'Yapay Zekaya Gönder'}
        </button>
      </form>
    </div>
  );
}