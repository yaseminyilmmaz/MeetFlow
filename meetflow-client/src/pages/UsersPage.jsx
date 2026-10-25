import { useOutletContext } from 'react-router-dom';
import { UserPlus, Mail, Briefcase, Trash2, Edit2 } from 'lucide-react';

export default function UsersPage() {
  const { 
    users, newUserName, setNewUserName, newUserEmail, setNewUserEmail, 
    newUserDept, setNewUserDept, handleUserSubmit,
    editingUserId, setEditingUserId, editingUserName, setEditingUserName,
    editingUserEmail, setEditingUserEmail, editingUserDept, setEditingUserDept,
    handleStartEditUser, handleSaveEditUser, handleDeleteUser
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
              const isEditing = editingUserId === user.id;
              
              return (
                <div key={user.id} style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => !isEditing && (e.currentTarget.style.transform = 'translateY(-4px)')} onMouseOut={(e) => !isEditing && (e.currentTarget.style.transform = 'translateY(0)')}>
                  
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input type="text" value={editingUserName} onChange={(e) => setEditingUserName(e.target.value)} placeholder="Ad Soyad" style={{ padding: '10px', border: '1px solid #0052cc', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }} />
                      <input type="email" value={editingUserEmail} onChange={(e) => setEditingUserEmail(e.target.value)} placeholder="E-posta" style={{ padding: '10px', border: '1px solid #0052cc', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }} />
                      <input type="text" value={editingUserDept} onChange={(e) => setEditingUserDept(e.target.value)} placeholder="Departman" style={{ padding: '10px', border: '1px solid #0052cc', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }} />
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <button onClick={() => handleSaveEditUser(user.id)} style={{ flex: 1, padding: '10px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Kaydet</button>
                        <button onClick={() => setEditingUserId(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#ebecf0', color: '#42526e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>İptal</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.3em' }}>
                          {getInitials(user.fullName)}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <strong style={{ color: 'var(--text-title)', fontSize: '1.15em', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.fullName}
                          </strong>
                          <span style={{ fontSize: '0.85em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Mail size={14} /> {user.email}
                          </span>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '16px', paddingBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Briefcase size={16} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.85em', color: 'var(--text-normal)', fontWeight: '600' }}>
                            {user.department || 'Belirtilmedi'}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleStartEditUser(user)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#fff0b3', color: '#ffab00', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Düzenle">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#ffebe6', color: '#ff5630', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Sil">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}