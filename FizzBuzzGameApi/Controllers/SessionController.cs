using Microsoft.AspNetCore.Mvc;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Services;

namespace FizzBuzzGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {
        private readonly ISessionService _sessionService;

        public SessionController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpPost]
        public async Task<ActionResult<SessionStateDto>> StartSession(StartSessionDto dto)
        {
            try
            {
                var result = await _sessionService.StartSessionAsync(dto);
                if (result == null)
                {
                    return NotFound("Game not found");
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while starting the session.");
            }
        }

        [HttpPost("{id}/answer")]
        public async Task<ActionResult<SessionStateDto>> SubmitAnswer(int id, SubmitAnswerDto dto)
        {
            try
            {
                var result = await _sessionService.SubmitAnswerAsync(id, dto);
                if (result == null)
                {
                    return NotFound("Session not found");
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while submitting the answer.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SessionStateDto>> GetSession(int id)
        {
            try
            {
                var result = await _sessionService.GetSessionAsync(id);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the session.");
            }
        }
    }
} 