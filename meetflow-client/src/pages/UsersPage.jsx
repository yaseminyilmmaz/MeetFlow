import { useOutletContext } from 'react-router-dom';

export default function UsersPage() {
  const { 
    users, newUserName, setNewUserName, newUserEmail, setNewUserEmail, 
    newUserDept, setNewUserDept, handleUserSubmit 
  } = useOutletContext();

  return (
    <div className="hide-item show-item">
      <h2 style={{ color: 'var(--text-title)', margin: '0 0 25px 0', fontSize: '1.8em', fontWeight: '800' }}>Kullanıcı Yönetimi</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px', backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', borderTop: '4px solid #36b37e', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-title)', fontSize: '1.2em', marginBottom: '15px' }}>
            Yeni Kullanıcı Ekle
          </h3>
          <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Ad Soyad" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)' }} />
            <input type="email" placeholder="E-posta" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)' }} />
            <input type="text" placeholder="Departman (Örn: Yazılım)" value={newUserDept} onChange={(e) => setNewUserDept(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Sisteme Kaydet
            </button>
          </form>
        </div>

        <div style={{ flex: '2', minWidth: '300px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-title)' }}>Sistemdeki Kullanıcılar ({users.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {users.map(user => (
              <div key={user.id} style={{ backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <strong style={{ color: 'var(--text-title)', fontSize: '1.1em' }}>{user.fullName}</strong>
                <span style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>{user.email}</span>
                <span style={{ fontSize: '0.8em', backgroundColor: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start', marginTop: '5px', fontWeight: '600' }}>
                  {user.department || 'Departman Belirtilmedi'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}