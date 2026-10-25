import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import MeetingsPage from './pages/MeetingsPage';
import UsersPage from './pages/UsersPage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5036';
const AI_BASE_URL = 'https://meetflow-1-gehu.onrender.com';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [taskUsers, setTaskUsers] = useState({});
  const [taskPriorities, setTaskPriorities] = useState({});
  const [users, setUsers] = useState([]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserDept, setNewUserDept] = useState("");

  const [filterUserId, setFilterUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskUserId, setEditingTaskUserId] = useState("");
  const [editingTaskPriority, setEditingTaskPriority] = useState("Orta");

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedText, setAnalyzedText] = useState("");

  const fetchMeetings = () => {
    fetch(`${API_BASE_URL}/api/meetings`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setMeetings(data))
      .catch(err => console.error(err))
  };

  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/api/users`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
  };

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
  }, []);

  const getCountdown = (dateString) => {
    const target = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (isNaN(diff)) return { text: "Tarih Yok", bg: "var(--bg-hover)", color: "var(--text-muted)" };
    if (diff < 0) return { text: "Süresi Geçti", bg: isDarkMode ? '#42160d' : '#ffebe6', color: "#ff5630" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return { text: `${days} gün kaldı`, bg: isDarkMode ? '#0d3323' : '#e3fcef', color: "#36b37e" };
    if (hours > 0) return { text: `${hours} saat kaldı`, bg: isDarkMode ? '#332700' : '#fff0b3', color: "#ffab00" };
    return { text: "1 saatten az", bg: isDarkMode ? '#332700' : '#fff0b3', color: "#ffab00" };
  };

  const parseTaskPriority = (fullTitle) => {
    if (!fullTitle) return { priority: "Orta", cleanTitle: "" };
    const match = fullTitle.match(/^(Acil|Orta|Düşük)\s*\|\s*(.*)$/i);
    if (match) {
      const priorityStr = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      return { priority: priorityStr, cleanTitle: match[2].trim() };
    }
    if (fullTitle.includes("|")) {
      const parts = fullTitle.split("|");
      return { priority: parts[0].trim() || "Orta", cleanTitle: parts.slice(1).join("|").trim() };
    }
    return { priority: "Orta", cleanTitle: fullTitle.trim() };
  };

  const getPriorityStyles = (priority, status) => {
    if (status === "Tamamlandı") {
      return { borderColor: 'var(--border-light)', tagBg: 'var(--bg-hover)', tagColor: 'var(--text-muted)' };
    }
    switch (priority) {
      case "Acil": return { borderColor: '#ff5630', tagBg: isDarkMode ? '#42160d' : '#ffebe6', tagColor: '#ff5630' };
      case "Orta": return { borderColor: '#36b37e', tagBg: isDarkMode ? '#0d3323' : '#e3fcef', tagColor: '#36b37e' };
      case "Düşük": return { borderColor: '#0052cc', tagBg: isDarkMode ? '#091e42' : '#deebff', tagColor: '#0052cc' };
      default: return { borderColor: 'var(--border-light)', tagBg: 'var(--bg-hover)', tagColor: 'var(--text-muted)' };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const newMeeting = { title, date };
    fetch(`${API_BASE_URL}/api/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeeting)
    })
    .then(res => res.json())
    .then(() => {
      fetchMeetings(); 
      setTitle(""); 
      setDate(""); 
      toast.success("Yeni toplantı başarıyla planlandı!");
    })
    .catch(err => console.error(err));
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const newUser = { fullName: newUserName, email: newUserEmail, department: newUserDept };
    fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(res => {
      if(res.ok) {
        fetchUsers(); 
        setNewUserName("");
        setNewUserEmail("");
        setNewUserDept("");
        toast.success("Kullanıcı başarıyla sisteme eklendi!");
      }
    })
    .catch(err => console.error(err));
  };

  const handleAudioUpload = (e) => {
    e.preventDefault();
    if (!audioFile) {
      toast.error("Lütfen önce bir ses veya video kaydı seçin.");
      return;
    }
    setIsAnalyzing(true);
    setAnalyzedText(""); 
    const toastId = toast.loading("Ses kaydı analiz ediliyor, lütfen bekleyin...");
    const formData = new FormData();
    formData.append("file", audioFile);
    fetch(`${AI_BASE_URL}/analyze-audio`, {
      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(async (data) => {
      setAnalyzedText(data.tam_metin);
      if (data.gorevler) {
        try {
          const cikarilanGorevler = JSON.parse(data.gorevler);
          const newMeeting = { 
            title: `AI Analizi: ${audioFile.name}`, 
            date: new Date().toISOString().slice(0, 16) 
          };
          const meetingRes = await fetch(`${API_BASE_URL}/api/meetings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMeeting)
          });
          const createdMeeting = await meetingRes.json();
          for (const gorev of cikarilanGorevler) {
            const newTask = {
              title: gorev.title,
              status: "Yapılacak",
              meetingId: createdMeeting.id,
              assignedUserId: null 
            };
            await fetch(`${API_BASE_URL}/api/tasks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newTask)
            });
          }
        } catch (error) {
          console.error("Yapay zeka verisi ayrıştırılamadı:", error);
        }
      }
      toast.update(toastId, { render: "Analiz Başarılı! Yapay Zeka görevleri oluşturdu.", type: "success", isLoading: false, autoClose: 3000 });
      setIsAnalyzing(false);
      setAudioFile(null);
      fetchMeetings();
    })
    .catch(err => {
      console.error(err);
      toast.update(toastId, { render: "Sunucu bağlantı sırasında bir hata oluştu.", type: "error", isLoading: false, autoClose: 4000 });
      setIsAnalyzing(false);
    });
  };

  const executeDeleteMeeting = (meetingId) => {
    fetch(`${API_BASE_URL}/api/meetings/${meetingId}`, { method: 'DELETE' })
    .then(res => {
      if(res.ok) {
        fetchMeetings();
        toast.error("Toplantı sistemden silindi.");
      }
    })
    .catch(err => console.error(err));
  };

  const confirmDeleteMeeting = (meetingId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>Bu toplantıyı ve içindeki tüm görevleri silmek istediğinize emin misiniz?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { executeDeleteMeeting(meetingId); closeToast(); }} style={{ padding: '6px 12px', backgroundColor: '#ff5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Evet, Sil</button>
            <button onClick={closeToast} style={{ padding: '6px 12px', backgroundColor: '#ebecf0', color: '#42526e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>İptal</button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const handleAddTask = (meetingId) => {
    const taskTitle = taskInputs[meetingId];
    if (!taskTitle) return; 
    const selectedUserId = taskUsers[meetingId] ? parseInt(taskUsers[meetingId]) : null;
    const priority = taskPriorities[meetingId] || "Orta";
    const finalTitle = `${priority} | ${taskTitle.trim()}`;
    const newTask = {
      title: finalTitle,
      status: "Yapılacak", 
      meetingId: meetingId,
      assignedUserId: selectedUserId 
    };
    fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
    .then(res => {
      if(res.ok) {
        fetchMeetings(); 
        setTaskInputs({ ...taskInputs, [meetingId]: "" }); 
        setTaskUsers({ ...taskUsers, [meetingId]: "" });
        setTaskPriorities({ ...taskPriorities, [meetingId]: "Orta" });
        toast.success("Görev eklendi!"); 
      }
    })
    .catch(err => console.error(err));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { method: 'DELETE' })
    .then(res => {
      if(res.ok) {
        fetchMeetings();
        toast.info("Görev silindi.");
      }
    })
    .catch(err => console.error(err));
  };

  const handleToggleStatus = (task) => {
    const currentStatus = task.status || task.Status;
    const updatedStatus = currentStatus === "Yapılacak" ? "Tamamlandı" : "Yapılacak";
    const updatedTask = { ...task, status: updatedStatus, Status: updatedStatus };
    fetch(`${API_BASE_URL}/api/tasks/${task.id || task.Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(res => {
      if(res.ok) fetchMeetings(); 
    })
    .catch(err => console.error(err));
  };

  const handleStartEdit = (task) => {
    const fullTitle = task.title || task.Title;
    const { priority, cleanTitle } = parseTaskPriority(fullTitle);
    setEditingTaskId(task.id || task.Id);
    setEditingTaskTitle(cleanTitle); 
    setEditingTaskPriority(priority); 
    setEditingTaskUserId(task.assignedUserId || task.AssignedUserId ? (task.assignedUserId || task.AssignedUserId).toString() : ""); 
  };

  const handleSaveEdit = (task) => {
    if (!editingTaskTitle.trim()) return;
    const selectedUserId = editingTaskUserId ? parseInt(editingTaskUserId) : null;
    const newTitle = `${editingTaskPriority} | ${editingTaskTitle.trim()}`;
    const updatedTask = {
      ...task,
      title: newTitle,
      Title: newTitle,
      assignedUserId: selectedUserId,
      AssignedUserId: selectedUserId
    };
    fetch(`${API_BASE_URL}/api/tasks/${task.id || task.Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(res => {
      if(res.ok) {
        fetchMeetings();
        setEditingTaskId(null);
        setEditingTaskTitle("");
        setEditingTaskUserId("");
        setEditingTaskPriority("Orta");
        toast.success("Görev güncellendi!");
      }
    })
    .catch(err => console.error(err));
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : "Atanmadı";
  };

  const filteredMeetings = meetings.filter(meeting => {
    const titleText = meeting.title || meeting.Title;
    return titleText && titleText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const contextData = {
    meetings, setMeetings, title, setTitle, date, setDate,
    taskInputs, setTaskInputs, taskUsers, setTaskUsers, taskPriorities, setTaskPriorities,
    users, setUsers, newUserName, setNewUserName, newUserEmail, setNewUserEmail,
    newUserDept, setNewUserDept, filterUserId, setFilterUserId, searchTerm, setSearchTerm,
    editingTaskId, setEditingTaskId, editingTaskTitle, setEditingTaskTitle,
    editingTaskUserId, setEditingTaskUserId, editingTaskPriority, setEditingTaskPriority,
    isDarkMode, setIsDarkMode, audioFile, setAudioFile, isAnalyzing, setIsAnalyzing,
    analyzedText, setAnalyzedText, fetchMeetings, fetchUsers, getCountdown, parseTaskPriority,
    getPriorityStyles, handleSubmit, handleUserSubmit, handleAudioUpload, executeDeleteMeeting,
    confirmDeleteMeeting, handleAddTask, handleDeleteTask, handleToggleStatus, handleStartEdit,
    handleSaveEdit, getUserName, filteredMeetings
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

          #root { max-width: 100% !important; margin: 0 !important; padding: 0 !important; width: 100%; }
          body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-body); }
          * { box-sizing: border-box; word-wrap: break-word; overflow-wrap: anywhere; }
          
          :root {
            --bg-body: #f8f9fa;
            --bg-card: #ffffff;
            --text-title: #0f172a;
            --text-normal: #334155;
            --text-muted: #64748b;
            --border-light: #e2e8f0;
            --bg-input: #f8fafc;
            --bg-hover: #f1f5f9;
          }
          
          .dark-mode {
            --bg-body: #0f172a;
            --bg-card: #1e293b;
            --text-title: #f8fafc;
            --text-normal: #cbd5e1;
            --text-muted: #94a3b8;
            --border-light: #334155;
            --bg-input: #0f172a;
            --bg-hover: #334155;
          }

          .hide-item { opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
          .show-item { opacity: 1; transform: translateY(0); }
          
          button { font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.3s ease !important; }
          button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          button:active { transform: translateY(0); }
          
          input, select { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            color: var(--text-normal); 
            transition: all 0.3s ease;
          }
          input:focus, select:focus { 
            border-color: #0052cc !important; 
            box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.15) !important; 
            background-color: var(--bg-card) !important;
          }
          
          .theme-toggle-btn { transition: background-color 0.4s ease, border 0.4s ease; user-select: none; }
          .theme-toggle-btn.light { background-color: #f1f3f5; border: 1px solid #e9ecef; }
          .theme-toggle-btn.dark { background-color: #1a1e23; border: 1px solid #2d3545; }
          
          .file-upload-label {
            display: flex; align-items: center; justify-content: center; gap: 10px;
            padding: 16px; border: 2px dashed #6554c0; border-radius: 12px;
            background-color: rgba(101, 84, 192, 0.05); color: #6554c0; cursor: pointer;
            font-weight: 700; transition: all 0.3s ease;
          }
          .file-upload-label:hover { background-color: rgba(101, 84, 192, 0.1); transform: translateY(-2px); }
        `}
      </style>

      <Routes>
        <Route path="/" element={<MainLayout {...contextData} />}>
          <Route index element={<Dashboard />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme={isDarkMode ? "dark" : "colored"} />
    </>
  )
}

export default App;