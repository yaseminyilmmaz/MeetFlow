import { useOutletContext } from 'react-router-dom';
import ManualMeetingForm from '../components/ManualMeetingForm';
import AudioAnalyzer from '../components/AudioAnalyzer';
import MeetingList from '../components/MeetingList';

export default function MeetingsPage() {
  const {
    handleSubmit, title, setTitle, date, setDate,
    handleAudioUpload, audioFile, setAudioFile, isAnalyzing,
    searchTerm, setSearchTerm, filterUserId, setFilterUserId, users,
    filteredMeetings, isDarkMode, taskPriorities, setTaskPriorities,
    taskInputs, setTaskInputs, taskUsers, setTaskUsers,
    editingTaskId, setEditingTaskId, editingTaskTitle, setEditingTaskTitle,
    editingTaskUserId, setEditingTaskUserId, editingTaskPriority, setEditingTaskPriority,
    confirmDeleteMeeting, handleToggleStatus, handleStartEdit, handleSaveEdit,
    handleDeleteTask, handleAddTask, getCountdown, parseTaskPriority,
    getPriorityStyles, getUserName, analyzedText, setAnalyzedText
  } = useOutletContext();

  return (
    <div className="hide-item show-item">
      <h2 style={{ color: 'var(--text-title)', margin: '0 0 25px 0', fontSize: '1.8em', fontWeight: '800' }}>Toplantılar ve Görevler</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', width: '100%', marginBottom: '50px' }}>
        <ManualMeetingForm handleSubmit={handleSubmit} title={title} setTitle={setTitle} date={date} setDate={setDate} />
        <AudioAnalyzer handleAudioUpload={handleAudioUpload} audioFile={audioFile} setAudioFile={setAudioFile} isAnalyzing={isAnalyzing} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
        <h3 style={{ color: 'var(--text-title)', margin: 0, fontSize: '1.2em', fontWeight: '700' }}>Kayıtlı Toplantılar</h3>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Toplantı Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '20px', outline: 'none', backgroundColor: 'var(--bg-card)', fontSize: '0.9em', minWidth: '200px' }} />
          <select value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '20px', outline: 'none', backgroundColor: 'var(--bg-card)', cursor: 'pointer', fontSize: '0.9em', fontWeight: '600' }}>
            <option value="">Tüm Kullanıcıları Göster</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.fullName} Görevleri</option>
            ))}
          </select>
          <span style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85em', fontWeight: '600' }}>
            Bulunan: {filteredMeetings.length}
          </span>
        </div>
      </div>

      <MeetingList 
        filteredMeetings={filteredMeetings} filterUserId={filterUserId} users={users} isDarkMode={isDarkMode}
        taskPriorities={taskPriorities} setTaskPriorities={setTaskPriorities} taskInputs={taskInputs} setTaskInputs={setTaskInputs}
        taskUsers={taskUsers} setTaskUsers={setTaskUsers} editingTaskId={editingTaskId} setEditingTaskId={setEditingTaskId}
        editingTaskTitle={editingTaskTitle} setEditingTaskTitle={setEditingTaskTitle} editingTaskUserId={editingTaskUserId}
        setEditingTaskUserId={setEditingTaskUserId} editingTaskPriority={editingTaskPriority} setEditingTaskPriority={setEditingTaskPriority}
        confirmDeleteMeeting={confirmDeleteMeeting} handleToggleStatus={handleToggleStatus} handleStartEdit={handleStartEdit}
        handleSaveEdit={handleSaveEdit} handleDeleteTask={handleDeleteTask} handleAddTask={handleAddTask}
        getCountdown={getCountdown} parseTaskPriority={parseTaskPriority} getPriorityStyles={getPriorityStyles} getUserName={getUserName}
      />

      {analyzedText && (
        <div className="hide-item show-item" style={{ marginTop: '50px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #6554c0', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-title)', fontSize: '1.3em', fontWeight: '700' }}>Analiz Edilen Ses Metni</h3>
            <button onClick={() => setAnalyzedText("")} style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9em' }}>Kapat</button>
          </div>
          <p style={{ lineHeight: '1.7', color: 'var(--text-normal)', fontSize: '1.05em', whiteSpace: 'pre-wrap', margin: 0 }}>{analyzedText}</p>
        </div>
      )}
    </div>
  );
}