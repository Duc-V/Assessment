using Microsoft.AspNetCore.Mvc;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Services;

[ApiController]
[Route("api/[controller]")]
public class SessionController : ControllerBase
{
    private readonly ISessionService _sessionService;
    public SessionController(ISessionService sessionService) => _sessionService = sessionService;

    [HttpPost]
    public async Task<ActionResult<SessionStateDto>> StartSession(StartSessionDto dto)
    {
        var result = await _sessionService.StartSessionAsync(dto);
        if (result == null) return NotFound("Game not found");
        return result;
    }

    [HttpPost("{id}/answer")]
    public async Task<ActionResult<SessionStateDto>> SubmitAnswer(int id, SubmitAnswerDto dto)
    {
        var result = await _sessionService.SubmitAnswerAsync(id, dto);
        if (result == null) return NotFound("Session not found");
        return result;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SessionStateDto>> GetSession(int id)
    {
        var result = await _sessionService.GetSessionAsync(id);
        if (result == null) return NotFound();
        return result;
    }
} 