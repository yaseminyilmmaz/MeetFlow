namespace MeetFlow.Api.Models
{
    public class Meeting
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
        public string Summary { get; set; } = string.Empty;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}