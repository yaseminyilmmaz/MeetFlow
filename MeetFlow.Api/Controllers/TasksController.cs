using MeetFlow.Api.Data;
using MeetFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetTasks()
        {
            var tasks = _context.Tasks
                                .Include(t => t.Meeting)
                                .Include(t => t.AssignedUser)
                                .ToList();
            return Ok(tasks);
        }

        [HttpPost]
        public IActionResult AddTask(TaskItem newTask)
        {
            _context.Tasks.Add(newTask);
            _context.SaveChanges();
            return Ok(newTask);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, TaskItem updatedTask)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
            {
                return NotFound("Görev bulunamadı.");
            }

            task.Title = updatedTask.Title;
            task.Status = updatedTask.Status;
            task.MeetingId = updatedTask.MeetingId;
            task.AssignedUserId = updatedTask.AssignedUserId;

            _context.SaveChanges();
            return Ok(task);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
            {
                return NotFound("Silinecek görev bulunamadı.");
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return Ok("Görev başarıyla silindi.");
        }
    }
}