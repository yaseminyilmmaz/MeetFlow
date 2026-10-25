import { useState } from 'react';

export default function MeetingList({
  filteredMeetings, filterUserId, users, isDarkMode, 
  taskPriorities, setTaskPriorities, taskInputs, setTaskInputs, taskUsers, setTaskUsers,
  editingTaskId, setEditingTaskId, editingTaskTitle, setEditingTaskTitle,
  editingTaskUserId, setEditingTaskUserId, editingTaskPriority, setEditingTaskPriority,
  editingMeetingId, setEditingMeetingId, editingMeetingTitle, setEditingMeetingTitle,
  editingMeetingDate, setEditingMeetingDate, handleStartEditMeeting, handleSaveEditMeeting,
  confirmDeleteMeeting, handleToggleStatus, handleStartEdit, handleSaveEdit, handleDeleteTask, handleAddTask,
  getCountdown, parseTaskPriority, getPriorityStyles, getUserName
}) {
  const [expandedMeetings, setExpandedMeetings] = useState({});
  const [showTextFor, setShowTextFor] = useState(null);

  const toggleExpand = (meetingId) => {
    setExpandedMeetings(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId]
    }));
  };

  return (
    <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px', alignItems: 'stretch', width: '100%' }}>
      {filteredMeetings.length === 0 ? (
        <div className="hide-item" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', color: 'var(--text-muted)', border: '1px dashed var(--border-light)' }}>
          <p style={{ fontSize: '1.1em', margin: 0 }}>Aradığınız kritere uygun toplantı bulunamadı.</p>
        </div>
      ) : (
        filteredMeetings.map(meeting => {
          const mTotalTasks = meeting.tasks ? meeting.tasks.length : 0;
          const mCompletedTasks = meeting.tasks ? meeting.tasks.filter(t => t.status === "Tamamlandı" || t.Status === "Tamamlandı").length : 0;
          const progressPercentage = mTotalTasks === 0 ? 0 : Math.round((mCompletedTasks / mTotalTasks) * 100);

          let progressColor = '#0052cc';
          if (progressPercentage === 100) progressColor = '#36b37e';
          else if (progressPercentage > 50) progressColor = '#ffab00';

          const countdown = getCountdown(meeting.date);
          const filteredTasks = meeting.tasks && meeting.tasks.length > 0 
            ? meeting.tasks.filter(task => filterUserId === "" || task.assignedUserId === parseInt(filterUserId) || task.AssignedUserId === parseInt(filterUserId))
            : [];

          const isExpanded = expandedMeetings[meeting.id];
          const visibleTasks = isExpanded ? filteredTasks : filteredTasks.slice(0, 1);
          const hasMoreTasks = filteredTasks.length > 1;
          const isEditingThisMeeting = editingMeetingId === meeting.id;

          const meetingTranscription = meeting.transcription || meeting.Transcription;

          return (
            <li key={meeting.id} className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '100%' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                
                {isEditingThisMeeting ? (
                  <div style={{ flex: '1', minWidth: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                      type="text" 
                      value={editingMeetingTitle} 
                      onChange={(e) => setEditingMeetingTitle(e.target.value)} 
                      placeholder="Toplantı Başlığı"
                      style={{ padding: '10px', border: '1px solid #ffab00', borderRadius: '8px', outline: 'none', backgroundColor: 'var(--bg-input)', fontSize: '1.1em', fontWeight: '700' }} 
                    />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="datetime-local" 
                        value={editingMeetingDate} 
                        onChange={(e) => setEditingMeetingDate(e.target.value)} 
                        style={{ padding: '10px', border: '1px solid #ffab00', borderRadius: '8px', outline: 'none', backgroundColor: 'var(--bg-input)', fontWeight: '600', flex: '1' }} 
                      />
                      <button 
                        onClick={() => handleSaveEditMeeting(meeting.id)} 
                        style={{ backgroundColor: '#36b37e', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                        Kaydet
                      </button>
                      <button 
                        onClick={() => setEditingMeetingId(null)} 
                        style={{ backgroundColor: '#ebecf0', color: '#42526e', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <strong style={{ fontSize: '1.3em', color: 'var(--text-title)', fontWeight: '700', letterSpacing: '-0.3px', display: 'block', marginBottom: '8px', wordBreak: 'break-word' }}>
                        {meeting.title}
                      </strong>

                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85em', fontWeight: '600' }}>
                          {new Date(meeting.date).toLocaleString('tr-TR')}
                        </span>
                        <span style={{ backgroundColor: countdown.bg, color: countdown.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75em', fontWeight: '700' }}>
                          {countdown.text}
                        </span>
                      </div>

                      <div style={{ width: '100%', backgroundColor: 'var(--bg-hover)', borderRadius: '8px', height: '10px', marginBottom: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercentage}%`, backgroundColor: progressColor, height: '100%', transition: 'width 0.5s ease-in-out, background-color 0.3s' }}></div>
                      </div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>
                        % {progressPercentage} Tamamlandı
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {meetingTranscription && (
                        <button 
                          onClick={() => setShowTextFor(showTextFor === meeting.id ? null : meeting.id)}
                          style={{ backgroundColor: 'transparent', color: '#0052cc', border: '1px solid #0052cc', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85em', fontWeight: '700', whiteSpace: 'nowrap' }}>
                          {showTextFor === meeting.id ? 'Metni Gizle' : 'Metni Görüntüle'}
                        </button>
                      )}
                      <button 
                        onClick={() => handleStartEditMeeting(meeting)}
                        style={{ backgroundColor: '#ffab00', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85em', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        Düzenle
                      </button>
                      <button 
                        onClick={() => confirmDeleteMeeting(meeting.id)}
                        style={{ backgroundColor: '#ff5630', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85em', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </div>

              {showTextFor === meeting.id && meetingTranscription && !isEditingThisMeeting && (
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed var(--border-light)', color: 'var(--text-normal)', fontSize: '0.9em', lineHeight: '1.6' }}>
                  <strong style={{ color: '#0052cc', display: 'block', marginBottom: '5px' }}>🎙️ Analiz Edilen Metin</strong>
                  {meetingTranscription}
                </div>
              )}

              <div style={{ marginTop: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '0.85em', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Alt Görevler
                </h4>

                <ul style={{ padding: '0', margin: '0 0 15px 0', listStyle: 'none', flex: 1 }}>
                  {visibleTasks.length > 0 ? (
                    visibleTasks.map(task => {
                      const fullTitle = task.title || task.Title;
                      const taskStatus = task.status || task.Status;
                      const assignedUser = task.assignedUserId || task.AssignedUserId;
                      const { priority, cleanTitle } = parseTaskPriority(fullTitle);
                      const styles = getPriorityStyles(priority, taskStatus);

                      return (
                        <li key={task.id || task.Id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid var(--border-light)', borderLeft: `5px solid ${styles.borderColor}`, borderRadius: '10px', marginBottom: '12px', backgroundColor: taskStatus === "Tamamlandı" ? 'var(--bg-hover)' : 'var(--bg-card)', transition: '0.2s' }}>

                          {editingTaskId === (task.id || task.Id) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <select value={editingTaskPriority} onChange={(e) => setEditingTaskPriority(e.target.value)} style={{ padding: '8px', border: '1px solid #0052cc', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-input)', fontSize: '0.85em', fontWeight: '600' }}>
                                  <option value="Acil">Acil</option>
                                  <option value="Orta">Orta</option>
                                  <option value="Düşük">Düşük</option>
                                </select>
                                <input type="text" value={editingTaskTitle} onChange={(e) => setEditingTaskTitle(e.target.value)} style={{ padding: '8px', flex: '1 1 150px', border: '1px solid #0052cc', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-input)' }} />
                                <select value={editingTaskUserId} onChange={(e) => setEditingTaskUserId(e.target.value)} style={{ padding: '8px', flex: '1 1 120px', border: '1px solid #0052cc', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-input)', fontSize: '0.85em', fontWeight: '600' }}>
                                  <option value="">Atama Yap</option>
                                  {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.fullName}</option>
                                  ))}
                                </select>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button onClick={() => handleSaveEdit(task)} style={{ backgroundColor: '#36b37e', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85em', fontWeight: '700' }}>Kaydet</button>
                                <button onClick={() => setEditingTaskId(null)} style={{ backgroundColor: '#ebecf0', color: '#42526e', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85em', fontWeight: '700' }}>İptal</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1, gap: '12px' }}>
                                  <input type="checkbox" checked={taskStatus === "Tamamlandı"} onChange={() => handleToggleStatus(task)} style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px', accentColor: '#0052cc' }} />
                                  <span style={{ textDecoration: taskStatus === "Tamamlandı" ? 'line-through' : 'none', color: taskStatus === "Tamamlandı" ? 'var(--text-muted)' : 'var(--text-normal)', fontSize: '0.95em', fontWeight: '600', lineHeight: '1.4' }}>
                                    {cleanTitle}
                                  </span> 
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                  <button onClick={() => handleStartEdit(task)} style={{ backgroundColor: 'transparent', color: '#0052cc', border: '1px solid #0052cc', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75em', fontWeight: '700' }}>Düzenle</button>
                                  <button onClick={() => handleDeleteTask(task.id || task.Id)} style={{ backgroundColor: 'transparent', color: '#ff5630', border: '1px solid #ff5630', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75em', fontWeight: '700' }}>Sil</button>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingLeft: '30px' }}>
                                {taskStatus !== "Tamamlandı" && (
                                  <span style={{ fontSize: '0.75em', backgroundColor: styles.tagBg, color: styles.tagColor, padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>{priority}</span>
                                )}
                                <span style={{ fontSize: '0.75em', backgroundColor: '#e3fcef', color: '#006644', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>👤 {getUserName(assignedUser)}</span>
                                <span style={{ fontSize: '0.75em', backgroundColor: taskStatus === "Tamamlandı" ? '#eae6ff' : '#ffebe6', color: taskStatus === "Tamamlandı" ? '#403294' : '#bf2600', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>{taskStatus}</span>
                              </div>
                            </>
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <li style={{ color: 'var(--text-muted)', fontSize: '0.9em', padding: '10px 0', fontStyle: 'italic' }}>Kayıtlı görev bulunamadı.</li>
                  )}
                </ul>

                {hasMoreTasks && (
                  <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: 'auto' }}>
                    <button 
                      onClick={() => toggleExpand(meeting.id)}
                      style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', fontWeight: '700', fontSize: '0.85em' }}
                    >
                      {isExpanded ? 'Daralt ▲' : `Tüm Görevleri Göster (${filteredTasks.length}) ▼`}
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: hasMoreTasks ? '0' : 'auto', backgroundColor: 'var(--bg-input)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <select value={taskPriorities[meeting.id] || "Orta"} onChange={(e) => setTaskPriorities({...taskPriorities, [meeting.id]: e.target.value})} style={{ padding: '10px', flex: '1 1 90px', border: '1px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-card)', fontWeight: '600' }}>
                    <option value="Acil">Acil</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                  <input type="text" placeholder="Görevi buraya yazın..." value={taskInputs[meeting.id] || ""} onChange={(e) => setTaskInputs({...taskInputs, [meeting.id]: e.target.value})} style={{ padding: '10px', flex: '3 1 180px', border: '1px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-card)' }} />
                  <select value={taskUsers[meeting.id] || ""} onChange={(e) => setTaskUsers({...taskUsers, [meeting.id]: e.target.value})} style={{ padding: '10px', flex: '1 1 120px', border: '1px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-card)', fontWeight: '600' }}>
                    <option value="">Atama Yap</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.fullName}</option>
                    ))}
                  </select>
                  <button onClick={() => handleAddTask(meeting.id)} style={{ padding: '10px 20px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', flex: '1 1 80px' }}>Ekle</button>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
}