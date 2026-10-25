import { useOutletContext } from 'react-router-dom';
import { UserPlus, Mail, Briefcase } from 'lucide-react';

export default function UsersPage() {
  const { 
    users, newUserName, setNewUserName, newUserEmail, setNewUserEmail, 
    newUserDept, setNewUserDept, handleUserSubmit 
  } = useOutletContext();

  const getInitials = (name) => {
    if (!name) return 'K';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const avatarColors = ['#0052cc', '#36b37e', '#ffab00', '#ff5630', '#6554c0'];

  return (
    <div className="hide-item show-item">
      <h2 style={{ color: 'var(--text-title)', margin: '0 0 35px 0', fontSize: '2.2em', fontWeight: '800', letterSpacing: '-0.5px' }}>
        Kullanıcı Yönetimi
      </h2>
      
      <div style={{ display: 'flex', gap: '35px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '420px', backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: 'rgba(54, 179, 126, 0.1)', color: '#36b37e', padding: '12px', borderRadius: '12px', display: 'flex' }}>
              <UserPlus size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-title)', fontSize: '1.4em', fontWeight: '800' }}>
              Yeni Kullanıcı Ekle
            </h3>
          </div>
          
          <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Ad Soyad" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)' }} />
            <input type="email" placeholder="E-posta" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)' }} />
            <input type="text" placeholder="Departman (Örn: Yazılım)" value={newUserDept} onChange={(e) => setNewUserDept(e.target.value)} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)' }} />
            <button type="submit" style={{ padding: '14px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '1.05em', marginTop: '10px' }}>
              Sisteme Kaydet
            </button>
          </form>
        </div>

        <div style={{ flex: '2', minWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-title)', fontSize: '1.4em', fontWeight: '800' }}>
              Sistemdeki Kullanıcılar 
              <span style={{ backgroundColor: '#0052cc', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75em', marginLeft: '12px', verticalAlign: 'middle' }}>
                {users.length}
              </span>
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {users.map((user, index) => {
              const color = avatarColors[index % avatarColors.length];
              
              return (
                <div key={user.id} style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.3em' }}>
                      {getInitials(user.fullName)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <strong style={{ color: 'var(--text-title)', fontSize: '1.15em', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.fullName}
                      </strong>
                      <span style={{ fontSize: '0.85em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Mail size={14} /> {user.email}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.85em', color: 'var(--text-normal)', fontWeight: '600' }}>
                      {user.department || 'Departman Belirtilmedi'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}