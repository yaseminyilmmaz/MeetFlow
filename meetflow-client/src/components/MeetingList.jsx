import { useState } from 'react';

export default function MeetingList({
  filteredMeetings, filterUserId, users, isDarkMode, 
  taskPriorities, setTaskPriorities, taskInputs, setTaskInputs, taskUsers, setTaskUsers,
  editingMeetingId, setEditingMeetingId, editingMeetingTitle, setEditingMeetingTitle,
  editingMeetingDate, setEditingMeetingDate, handleStartEditMeeting, handleSaveEditMeeting,
  confirmDeleteMeeting, handleToggleStatus, handleDeleteTask, handleAddTask,
  getCountdown, parseTaskPriority, getPriorityStyles, getUserName
}) {
  const [expandedMeetings, setExpandedMeetings] = useState({});
  const [showTextFor, setShowTextFor] = useState(null);

  const toggleExpand = (meetingId) => setExpandedMeetings(prev => ({ ...prev, [meetingId]: !prev[meetingId] }));

  return (
    <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px', alignItems: 'stretch', width: '100%' }}>
      {filteredMeetings.length === 0 ? (
        <div className="hide-item" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1em', margin: 0 }}>Toplantı bulunamadı.</p>
        </div>
      ) : (
        filteredMeetings.map(meeting => {
          const mTotalTasks = meeting.tasks ? meeting.tasks.length : 0;
          const mCompletedTasks = meeting.tasks ? meeting.tasks.filter(t => t.status === "Tamamlandı" || t.Status === "Tamamlandı").length : 0;
          const progressPercentage = mTotalTasks === 0 ? 0 : Math.round((mCompletedTasks / mTotalTasks) * 100);
          const countdown = getCountdown(meeting.date);
          const filteredTasks = meeting.tasks ? meeting.tasks.filter(task => filterUserId === "" || task.assignedUserId === parseInt(filterUserId) || task.AssignedUserId === parseInt(filterUserId)) : [];
          
          const isExpanded = expandedMeetings[meeting.id];
          const visibleTasks = isExpanded ? filteredTasks : filteredTasks.slice(0, 1);
          const hasMoreTasks = filteredTasks.length > 1;
          const isEditingThisMeeting = editingMeetingId === meeting.id;

          const meetingTranscription = meeting.transcription || meeting.Transcription; // C#'tan gelecek veri

          return (
            <li key={meeting.id} className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '100%' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                
                {isEditingThisMeeting ? (
                  <div style={{ flex: '1', minWidth: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" value={editingMeetingTitle} onChange={(e) => setEditingMeetingTitle(e.target.value)} placeholder="Toplantı Başlığı" style={{ padding: '10px', border: '1px solid #ffab00', borderRadius: '8px', outline: 'none', backgroundColor: 'var(--bg-input)', fontSize: '1.1em', fontWeight: '700' }} />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input type="datetime-local" value={editingMeetingDate} onChange={(e) => setEditingMeetingDate(e.target.value)} style={{ padding: '10px', border: '1px solid #ffab00', borderRadius: '8px', outline: 'none', backgroundColor: 'var(--bg-input)', fontWeight: '600', flex: '1' }} />
                      <button onClick={() => handleSaveEditMeeting(meeting.id)} style={{ backgroundColor: '#36b37e', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Kaydet</button>
                      <button onClick={() => setEditingMeetingId(null)} style={{ backgroundColor: '#ebecf0', color: '#42526e', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>İptal</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <strong style={{ fontSize: '1.3em', color: 'var(--text-title)', fontWeight: '700', letterSpacing: '-0.3px', display: 'block', marginBottom: '8px' }}>{meeting.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85em', fontWeight: '600' }}>{new Date(meeting.date).toLocaleString('tr-TR')}</span>
                        <span style={{ backgroundColor: countdown.bg, color: countdown.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75em', fontWeight: '700' }}>{countdown.text}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {meetingTranscription && (
                        <button onClick={() => setShowTextFor(showTextFor === meeting.id ? null : meeting.id)} style={{ backgroundColor: 'transparent', color: '#0052cc', border: '1px solid #0052cc', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '700' }}>
                          {showTextFor === meeting.id ? 'Metni Gizle' : 'Metni Gör'}
                        </button>
                      )}
                      <button onClick={() => handleStartEditMeeting(meeting)} style={{ backgroundColor: '#ffab00', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '700' }}>Düzenle</button>
                      <button onClick={() => confirmDeleteMeeting(meeting.id)} style={{ backgroundColor: '#ff5630', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '700' }}>Sil</button>
                    </div>
                  </>
                )}
              </div>

              {showTextFor === meeting.id && meetingTranscription && !isEditingThisMeeting && (
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #0052cc', color: 'var(--text-normal)', fontSize: '0.95em', lineHeight: '1.6' }}>
                  {meetingTranscription}
                </div>
              )}

              <div style={{ marginTop: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <ul style={{ padding: '0', margin: '0 0 15px 0', listStyle: 'none', flex: 1 }}>
                  {visibleTasks.map(task => {
                    const taskStatus = task.status || task.Status;
                    const { priority, cleanTitle } = parseTaskPriority(task.title || task.Title);
                    const styles = getPriorityStyles(priority, taskStatus);

                    return (
                      <li key={task.id || task.Id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid var(--border-light)', borderLeft: `5px solid ${styles.borderColor}`, borderRadius: '10px', marginBottom: '8px', backgroundColor: taskStatus === "Tamamlandı" ? 'var(--bg-hover)' : 'var(--bg-card)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <input type="checkbox" checked={taskStatus === "Tamamlandı"} onChange={() => handleToggleStatus(task)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                          <span style={{ textDecoration: taskStatus === "Tamamlandı" ? 'line-through' : 'none', color: taskStatus === "Tamamlandı" ? 'var(--text-muted)' : 'var(--text-normal)', fontSize: '0.95em', fontWeight: '600' }}>
                            {cleanTitle}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteTask(task.id || task.Id)} style={{ backgroundColor: 'transparent', color: '#ff5630', border: '1px solid #ff5630', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75em', fontWeight: '700' }}>Sil</button>
                      </li>
                    );
                  })}
                </ul>

                {hasMoreTasks && (
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <button onClick={() => toggleExpand(meeting.id)} style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', fontWeight: '700', fontSize: '0.85em' }}>
                      {isExpanded ? 'Daralt ▲' : `Tüm Görevleri Göster (${filteredTasks.length}) ▼`}
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <input type="text" placeholder="Yeni görev ekle..." value={taskInputs[meeting.id] || ""} onChange={(e) => setTaskInputs({...taskInputs, [meeting.id]: e.target.value})} style={{ padding: '10px', flex: '1', border: '1px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-card)' }} />
                  <button onClick={() => handleAddTask(meeting.id)} style={{ padding: '10px 20px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>Ekle</button>
                </div>
              </div>

            </li>
          );
        })
      )}
    </ul>
  );
}