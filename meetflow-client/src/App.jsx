import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardStats from './components/DashboardStats';
import AudioAnalyzer from './components/AudioAnalyzer';
import ManualMeetingForm from './components/ManualMeetingForm';
import MeetingList from './components/MeetingList';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5036';
const AI_BASE_URL = 'https://meetflow-1-gehu.onrender.com';

function App() {
  const [meetings, setMeetings] = useState([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [taskInputs, setTaskInputs] = useState({})
  const [taskUsers, setTaskUsers] = useState({})
  const [taskPriorities, setTaskPriorities] = useState({})
  const [users, setUsers] = useState([])
  
  // Yeni Kullanıcı Ekleme Formu Stateleri
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserDept, setNewUserDept] = useState("")
  
  const [filterUserId, setFilterUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [analyzedText, setAnalyzedText] = useState("");

  const fetchMeetings = () => {
    fetch(`${API_BASE_URL}/api/meetings`)
      .then(res => res.json())
      .then(data => setMeetings(data))
      .catch(err => console.error(err))
  }

  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-item');
        }
      });
    }, { threshold: 0.1 }); 

    const hiddenElements = document.querySelectorAll('.hide-item');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, [meetings, searchTerm, filterUserId, isDarkMode, analyzedText]); 

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
  }

  const parseTaskPriority = (fullTitle) => {
    if (fullTitle.startsWith("Acil | ")) return { priority: "Acil", cleanTitle: fullTitle.substring(7) };
    if (fullTitle.startsWith("Orta | ")) return { priority: "Orta", cleanTitle: fullTitle.substring(7) };
    if (fullTitle.startsWith("Düşük | ")) return { priority: "Düşük", cleanTitle: fullTitle.substring(9) };
    return { priority: "Orta", cleanTitle: fullTitle };
  }

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
  }

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
  }
  
  // YENİ KULLANICI EKLEME İŞLEMİ
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
  }

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
      
      toast.update(toastId, { 
        render: "Analiz Başarılı! Yapay Zeka görevleri oluşturdu.", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      
      setIsAnalyzing(false);
      setAudioFile(null);
      fetchMeetings();
    })
    .catch(err => {
      console.error(err);
      toast.update(toastId, { 
        render: "Sunucu bağlantı sırasında bir hata oluştu.", 
        type: "error", 
        isLoading: false, 
        autoClose: 4000 
      });
      setIsAnalyzing(false);
    });
  }

  const confirmDeleteMeeting = (meetingId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>
            Bu toplantıyı ve içindeki tüm görevleri silmek istediğinize emin misiniz?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => {
                executeDeleteMeeting(meetingId);
                closeToast();
              }} 
              style={{ padding: '6px 12px', backgroundColor: '#ff5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Evet, Sil
            </button>
            <button 
              onClick={closeToast} 
              style={{ padding: '6px 12px', backgroundColor: '#ebecf0', color: '#42526e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              İptal
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const executeDeleteMeeting = (meetingId) => {
    fetch(`${API_BASE_URL}/api/meetings/${meetingId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if(res.ok) {
        fetchMeetings();
        toast.error("Toplantı sistemden silindi.");
      }
    })
    .catch(err => console.error(err));
  }

  const handleAddTask = (meetingId) => {
    const taskTitle = taskInputs[meetingId];
    if (!taskTitle) return; 

    const selectedUserId = taskUsers[meetingId] ? parseInt(taskUsers[meetingId]) : null;
    const priority = taskPriorities[meetingId] || "Orta";
    const finalTitle = `${priority} | ${taskTitle}`;

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
  }

  const handleDeleteTask = (taskId) => {
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if(res.ok) {
        fetchMeetings();
        toast.info("Görev silindi.");
      }
    })
    .catch(err => console.error(err));
  }

  const handleToggleStatus = (task) => {
    const updatedStatus = task.status === "Yapılacak" ? "Tamamlandı" : "Yapılacak";
    
    const updatedTask = {
      ...task,
      status: updatedStatus
    };

    fetch(`${API_BASE_URL}/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(res => {
      if(res.ok) fetchMeetings(); 
    })
    .catch(err => console.error(err));
  }

  const handleStartEdit = (task) => {
    const { cleanTitle } = parseTaskPriority(task.title);
    setEditingTaskId(task.id);
    setEditingTaskTitle(cleanTitle);
  }

  const handleSaveEdit = (task) => {
    if (!editingTaskTitle.trim()) return;
    
    const { priority } = parseTaskPriority(task.title);
    const updatedTask = {
      ...task,
      title: `${priority} | ${editingTaskTitle}`
    };

    fetch(`${API_BASE_URL}/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(res => {
      if(res.ok) {
        fetchMeetings();
        setEditingTaskId(null);
        setEditingTaskTitle("");
        toast.success("Görev güncellendi!");
      }
    })
    .catch(err => console.error(err));
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : "Atanmadı";
  }

  const totalMeetings = meetings.length;
  const totalTasks = meetings.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
  const completedTasks = meetings.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.filter(t => t.status === "Tamamlandı").length : 0), 0);
  const pendingTasks = totalTasks - completedTasks;

  const filteredMeetings = meetings.filter(meeting => 
    meeting.title && meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={isDarkMode ? 'dark-mode' : ''} style={{ padding: '30px 40px', fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-normal)', transition: 'background-color 0.3s, color 0.3s', width: '100%' }}>
      
      <style>
        {`
          #root {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
          }
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            width: 100%;
          }
          * {
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: anywhere;
          }
          :root {
            --bg-body: #f4f5f7;
            --bg-card: #ffffff;
            --text-title: #091e42;
            --text-normal: #172b4d;
            --text-muted: #5e6c84;
            --border-light: #dfe1e6;
            --bg-input: #fafbfc;
            --bg-hover: #ebecf0;
          }
          .dark-mode {
            --bg-body: #12151a;
            --bg-card: #1c212b;
            --text-title: #ffffff;
            --text-normal: #d7dbe3;
            --text-muted: #8b99af;
            --border-light: #2d3545;
            --bg-input: #12151a;
            --bg-hover: #262c38;
          }
          .hide-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .show-item {
            opacity: 1;
            transform: translateY(0);
          }
          .btn-primary:hover { background-color: #0052cc !important; }
          .btn-success:hover { background-color: #218838 !important; }
          .btn-danger:hover { background-color: #c82333 !important; }
          .btn-warning:hover { background-color: #e06b00 !important; }
          input, select { color: var(--text-normal); }
          input:focus, select:focus { border-color: #4c9aff !important; box-shadow: 0 0 0 2px rgba(76, 154, 255, 0.2) !important; }

          .theme-toggle-btn {
            width: 64px;
            height: 44px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            transition: background-color 0.4s ease, border 0.4s ease;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            user-select: none;
          }
          .theme-toggle-btn.light {
            background-color: #f1f3f5;
            border: 1px solid #e9ecef;
          }
          .theme-toggle-btn.dark {
            background-color: #1a1e23;
            border: 1px solid #2d3545;
          }
          .toggle-thumb {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #ffffff;
            position: absolute;
            top: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .theme-toggle-btn.light .toggle-thumb {
            transform: translateX(4px);
          }
          .theme-toggle-btn.dark .toggle-thumb {
            transform: translateX(24px);
          }
          
          .file-upload-label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px;
            border: 2px dashed #6554c0;
            border-radius: 6px;
            background-color: rgba(101, 84, 192, 0.05);
            color: #6554c0;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
          }
          .file-upload-label:hover {
            background-color: rgba(101, 84, 192, 0.1);
          }
        `}
      </style>

      <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginBottom: '40px', minHeight: '50px' }}>
          <h1 style={{ margin: 0, color: 'var(--text-title)', fontWeight: '800', letterSpacing: '-0.5px' }}>
            MeetFlow
          </h1>
          
          <div 
            className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`} 
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            <div className="toggle-thumb">
              {!isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </div>
          </div>
        </div>

        <DashboardStats 
          totalMeetings={totalMeetings} 
          totalTasks={totalTasks} 
          completedTasks={completedTasks} 
          pendingTasks={pendingTasks} 
        />
        
        {/* ÜST PANEL: TOPLANTI EKLE, SES YÜKLE VE YENİ KULLANICI EKLE FORMLARI */}
        <div className="hide-item show-item" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', width: '100%', marginBottom: '50px' }}>
          
          <ManualMeetingForm 
            handleSubmit={handleSubmit} 
            title={title} 
            setTitle={setTitle} 
            date={date} 
            setDate={setDate} 
          />

          <AudioAnalyzer 
            handleAudioUpload={handleAudioUpload} 
            audioFile={audioFile} 
            setAudioFile={setAudioFile} 
            isAnalyzing={isAnalyzing} 
          />

          {/* YENİ EKLENEN KULLANICI EKLEME KARTI */}
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-title)', fontSize: '1.2em', marginBottom: '15px' }}>
              👤 Yeni Kullanıcı Ekle
            </h3>
            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)', fontSize: '0.95em' }}
              />
              <input
                type="email"
                placeholder="E-posta"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)', fontSize: '0.95em' }}
              />
              <input
                type="text"
                placeholder="Departman (Örn: Yazılım)"
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)', fontSize: '0.95em' }}
              />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#36b37e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', marginTop: '4px', transition: 'background-color 0.2s' }}>
                Sisteme Kaydet
              </button>
            </form>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
          <h2 style={{ color: 'var(--text-title)', margin: 0, fontSize: '1.4em', fontWeight: '700' }}>Sistemdeki Toplantılar</h2>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Toplantı Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '20px', outline: 'none', backgroundColor: 'var(--bg-card)', fontSize: '0.9em', minWidth: '200px' }}
            />

            <select 
              value={filterUserId} 
              onChange={(e) => setFilterUserId(e.target.value)}
              style={{ padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '20px', outline: 'none', backgroundColor: 'var(--bg-card)', cursor: 'pointer', fontSize: '0.9em', fontWeight: '600' }}
            >
              <option value="">Tüm Görevleri Göster</option>
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
          filteredMeetings={filteredMeetings}
          filterUserId={filterUserId}
          users={users}
          isDarkMode={isDarkMode}
          taskPriorities={taskPriorities}
          setTaskPriorities={setTaskPriorities}
          taskInputs={taskInputs}
          setTaskInputs={setTaskInputs}
          taskUsers={taskUsers}
          setTaskUsers={setTaskUsers}
          editingTaskId={editingTaskId}
          setEditingTaskId={setEditingTaskId}
          editingTaskTitle={editingTaskTitle}
          setEditingTaskTitle={setEditingTaskTitle}
          confirmDeleteMeeting={confirmDeleteMeeting}
          handleToggleStatus={handleToggleStatus}
          handleStartEdit={handleStartEdit}
          handleSaveEdit={handleSaveEdit}
          handleDeleteTask={handleDeleteTask}
          handleAddTask={handleAddTask}
          getCountdown={getCountdown}
          parseTaskPriority={parseTaskPriority}
          getPriorityStyles={getPriorityStyles}
          getUserName={getUserName}
        />

        {analyzedText && (
          <div className="hide-item show-item" style={{ marginTop: '50px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #6554c0', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-title)', fontSize: '1.3em', fontWeight: '700' }}>
                Analiz Edilen Ses Metni
              </h3>
              <button 
                onClick={() => setAnalyzedText("")} 
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9em' }}>
                Kapat
              </button>
            </div>
            <p style={{ lineHeight: '1.7', color: 'var(--text-normal)', fontSize: '1.05em', whiteSpace: 'pre-wrap', margin: 0 }}>
              {analyzedText}
            </p>
          </div>
        )}

      </div>
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme={isDarkMode ? "dark" : "colored"} />
    </div>
  )
}

export default App