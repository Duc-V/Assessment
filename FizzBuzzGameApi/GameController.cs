using Microsoft.AspNetCore.Mvc;
using FizzBuzzGameApi.Models;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Services;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly IFizzBuzzService _service;
    public GameController(IFizzBuzzService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameDefinitionDto>>> GetGames()
    {
        return await _service.GetGamesAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GameDefinitionDto>> GetGame(int id)
    {
        var game = await _service.GetGameAsync(id);
        if (game == null) return NotFound();
        return game;
    }

    [HttpGet("{id}/rules")]
    public async Task<ActionResult<IEnumerable<GameRuleDto>>> GetGameRules(int id)
    {
        var rules = await _service.GetGameRulesAsync(id);
        if (rules == null || rules.Count == 0) return NotFound();
        return rules;
    }

    [HttpPost]
    public async Task<ActionResult<GameDefinitionDto>> CreateGame(CreateGameDto dto)
    {
        try
        {
            var game = await _service.CreateGameAsync(dto);
            return CreatedAtAction(nameof(GetGame), new { id = game!.id }, game);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var deleted = await _service.DeleteGameAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
} 