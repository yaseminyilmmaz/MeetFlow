using System;
using System.Collections.Generic;

namespace MeetFlow.Api.Models
{
    public class Meeting
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }

        public string? Transcription { get; set; }

        public List<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}