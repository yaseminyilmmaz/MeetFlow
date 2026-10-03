using MeetFlow.Api.Data;
using MeetFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MeetingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMeetings()
        {

            var meetings = _context.Meetings.Include(m => m.Tasks).ToList();
            return Ok(meetings);
        }

        [HttpPost]
        public IActionResult AddMeeting(Meeting newMeeting)
        {
            _context.Meetings.Add(newMeeting);
            _context.SaveChanges();

            return Ok(newMeeting);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMeeting(int id)
        {
            var meeting = _context.Meetings.Find(id);

            if (meeting == null)
            {
                return NotFound();
            }

            _context.Meetings.Remove(meeting);
            _context.SaveChanges();

            return Ok();
        }
    }
}