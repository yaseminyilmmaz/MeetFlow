import { useOutletContext } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';

export default function Dashboard() {
  const { meetings } = useOutletContext();

  const totalMeetings = meetings.length;
  const totalTasks = meetings.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
  const completedTasks = meetings.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.filter(t => (t.status || t.Status) === "Tamamlandı").length : 0), 0);
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="hide-item show-item">
      <h2 style={{ color: 'var(--text-title)', margin: '0 0 25px 0', fontSize: '1.8em', fontWeight: '800' }}>Dashboard (Genel Bakış)</h2>
      <DashboardStats 
        totalMeetings={totalMeetings} 
        totalTasks={totalTasks} 
        completedTasks={completedTasks} 
        pendingTasks={pendingTasks} 
      />
    </div>
  );
}