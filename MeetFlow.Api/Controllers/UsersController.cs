using MeetFlow.Api.Data;
using MeetFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;

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
    }
}