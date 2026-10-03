export default function MeetingList({
  filteredMeetings, filterUserId, users, isDarkMode, 
  taskPriorities, setTaskPriorities, taskInputs, setTaskInputs, taskUsers, setTaskUsers,
  editingTaskId, setEditingTaskId, editingTaskTitle, setEditingTaskTitle,
  confirmDeleteMeeting, handleToggleStatus, handleStartEdit, handleSaveEdit, handleDeleteTask, handleAddTask,
  getCountdown, parseTaskPriority, getPriorityStyles, getUserName
}) {
  return (
    <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px', alignItems: 'start', width: '100%' }}>
      {filteredMeetings.length === 0 ? (
        <div className="hide-item" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', color: 'var(--text-muted)', border: '1px dashed var(--border-light)' }}>
          <p style={{ fontSize: '1.1em', margin: 0 }}>Aradığınız kritere uygun toplantı bulunamadı.</p>
        </div>
      ) : (
        filteredMeetings.map(meeting => {
          const mTotalTasks = meeting.tasks ? meeting.tasks.length : 0;
          const mCompletedTasks = meeting.tasks ? meeting.tasks.filter(t => t.status === "Tamamlandı").length : 0;
          const progressPercentage = mTotalTasks === 0 ? 0 : Math.round((mCompletedTasks / mTotalTasks) * 100);
          
          let progressColor = '#0052cc';
          if (progressPercentage === 100) progressColor = '#36b37e';
          else if (progressPercentage > 50) progressColor = '#ffab00';

          const countdown = getCountdown(meeting.date);

          return (
            <li key={meeting.id} className="hide-item show-item" style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ width: '100%' }}>
                  <strong style={{ fontSize: '1.3em', color: 'var(--text-title)', fontWeight: '700', letterSpacing: '-0.3px', display: 'block', marginBottom: '5px' }}>{meeting.title}</strong>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85em', fontWeight: '600' }}>
                      {new Date(meeting.date).toLocaleString('tr-TR')}
                    </span>
                    <span style={{ backgroundColor: countdown.bg, color: countdown.color, padding: '3px 8px', borderRadius: '12px', fontSize: '0.75em', fontWeight: '700' }}>
                      {countdown.text}
                    </span>
                  </div>
                  
                  <div style={{ width: '100%', backgroundColor: 'var(--bg-hover)', borderRadius: '8px', height: '10px', marginBottom: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercentage}%`, backgroundColor: progressColor, height: '100%', transition: 'width 0.5s ease-in-out, background-color 0.3s' }}></div>
                  </div>
                  <div style={{ fontSize: '0.8em', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>
                    % {progressPercentage} Tamamlandı
                  </div>
                </div>
                
                <button 
                  className="btn-danger"
                  onClick={() => confirmDeleteMeeting(meeting.id)}
                  style={{ backgroundColor: '#ff5630', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.85em', fontWeight: '600', transition: '0.2s', marginLeft: '20px', whiteSpace: 'nowrap' }}>
                  Toplantıyı Sil
                </button>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9em', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Alt Görevler
                </h4>
                
                <ul style={{ padding: '0', margin: '0 0 25px 0', listStyle: 'none' }}>
                  {meeting.tasks && meeting.tasks.length > 0 ? (
                    meeting.tasks
                      .filter(task => filterUserId === "" || task.assignedUserId === parseInt(filterUserId))
                      .map(task => {
                        const { priority, cleanTitle } = parseTaskPriority(task.title);
                        const styles = getPriorityStyles(priority, task.status);
                        
                        return (
                          <li key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', border: '1px solid var(--border-light)', borderLeft: `5px solid ${styles.borderColor}`, borderRadius: '6px', marginBottom: '8px', backgroundColor: task.status === "Tamamlandı" ? 'var(--bg-hover)' : 'var(--bg-card)', transition: '0.2s', flexWrap: 'wrap', gap: '10px' }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                              <input 
                                type="checkbox" 
                                checked={task.status === "Tamamlandı"}
                                onChange={() => handleToggleStatus(task)}
                                style={{ marginRight: '15px', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#0052cc' }}
                              />

                              {editingTaskId === task.id ? (
                                <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                                  <input 
                                    type="text" 
                                    value={editingTaskTitle}
                                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                                    style={{ padding: '4px 8px', flex: 1, border: '1px solid #0052cc', borderRadius: '4px', outline: 'none', backgroundColor: 'var(--bg-input)' }}
                                  />
                                  <button 
                                    onClick={() => handleSaveEdit(task)}
                                    style={{ backgroundColor: '#36b37e', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '600' }}>
                                    Kaydet
                                  </button>
                                  <button 
                                    onClick={() => setEditingTaskId(null)}
                                    style={{ backgroundColor: '#ebecf0', color: '#42526e', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '600' }}>
                                    İptal
                                  </button>
                                </div>
                              ) : (
                                <span style={{ 
                                  flex: 1, 
                                  textDecoration: task.status === "Tamamlandı" ? 'line-through' : 'none',
                                  color: task.status === "Tamamlandı" ? 'var(--text-muted)' : 'var(--text-normal)',
                                  fontSize: '0.95em',
                                  fontWeight: '500'
                                }}>
                                  {cleanTitle}
                                </span> 
                              )}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              {task.status !== "Tamamlandı" && (
                                <span style={{ fontSize: '0.75em', backgroundColor: styles.tagBg, color: styles.tagColor, padding: '4px 8px', borderRadius: '4px', fontWeight: '700' }}>
                                  {priority}
                                </span>
                              )}

                              <span style={{ fontSize: '0.8em', backgroundColor: '#e3fcef', color: '#006644', padding: '4px 10px', borderRadius: '3px', fontWeight: '600' }}>
                                {getUserName(task.assignedUserId)}
                              </span>

                              <span style={{ fontSize: '0.8em', backgroundColor: task.status === "Tamamlandı" ? '#eae6ff' : '#ffebe6', color: task.status === "Tamamlandı" ? '#403294' : '#bf2600', padding: '4px 10px', borderRadius: '3px', fontWeight: '600' }}>
                                {task.status}
                              </span>

                              {editingTaskId !== task.id && (
                                <button 
                                  onClick={() => handleStartEdit(task)}
                                  style={{ backgroundColor: '#ffab00', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '600', transition: '0.2s' }}>
                                  Düzenle
                                </button>
                              )}

                              <button 
                                className="btn-danger"
                                onClick={() => handleDeleteTask(task.id)}
                                style={{ backgroundColor: '#ff5630', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8em', fontWeight: '600', transition: '0.2s' }}>
                                Sil
                              </button>
                            </div>
                          </li>
                        );
                      })
                  ) : (
                    <li style={{ color: 'var(--text-muted)', fontSize: '0.9em', padding: '10px 0', fontStyle: 'italic' }}>Kayıtlı görev bulunamadı.</li>
                  )}
                </ul>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select 
                    value={taskPriorities[meeting.id] || "Orta"} 
                    onChange={(e) => setTaskPriorities({...taskPriorities, [meeting.id]: e.target.value})}
                    style={{ padding: '10px 8px', flex: '1 1 100px', border: '2px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-input)', cursor: 'pointer', fontWeight: '600' }}
                  >
                    <option value="Acil">Acil</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>

                  <input 
                    type="text" 
                    placeholder="Görevi buraya yazın..." 
                    value={taskInputs[meeting.id] || ""} 
                    onChange={(e) => setTaskInputs({...taskInputs, [meeting.id]: e.target.value})}
                    style={{ padding: '10px 14px', flex: '3 1 200px', border: '2px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-input)', transition: '0.2s' }}
                  />
                  <select 
                    value={taskUsers[meeting.id] || ""} 
                    onChange={(e) => setTaskUsers({...taskUsers, [meeting.id]: e.target.value})}
                    style={{ padding: '10px 14px', flex: '1 1 120px', border: '2px solid var(--border-light)', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-input)', transition: '0.2s', cursor: 'pointer' }}
                  >
                    <option value="">Atama Yap</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.fullName}</option>
                    ))}
                  </select>
                  <button 
                    className="btn-success"
                    onClick={() => handleAddTask(meeting.id)}
                    style={{ padding: '10px 24px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', flex: '1 1 80px' }}>
                    Ekle
                  </button>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
}