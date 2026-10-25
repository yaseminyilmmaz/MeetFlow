using MeetFlow.Api.Data;
using MeetFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MeetFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpPost]
        public IActionResult AddUser(User newUser)
        {
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok(newUser);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest();
            }

            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FullName = updatedUser.FullName;
            user.Email = updatedUser.Email;
            user.Department = updatedUser.Department;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok();
        }
    }
}