namespace MeetFlow.Api.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "Yapılacak";

        public int MeetingId { get; set; }
        public Meeting? Meeting { get; set; }

        public int? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }
    }
}