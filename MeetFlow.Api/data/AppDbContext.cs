using MeetFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetFlow.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Meeting> Meetings { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
    }
}