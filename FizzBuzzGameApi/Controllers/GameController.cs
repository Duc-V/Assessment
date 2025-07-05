using Microsoft.AspNetCore.Mvc;
using FizzBuzzGameApi.Models;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Services;

namespace FizzBuzzGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IFizzBuzzService _service;

        public GameController(IFizzBuzzService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameDefinitionDto>>> GetGames()
        {
            try
            {
                var games = await _service.GetGamesAsync();
                return Ok(games);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving games.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GameDefinitionDto>> GetGame(int id)
        {
            try
            {
                var game = await _service.GetGameAsync(id);
                if (game == null)
                {
                    return NotFound();
                }

                return Ok(game);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the game.");
            }
        }

        [HttpGet("{id}/rules")]
        public async Task<ActionResult<IEnumerable<GameRuleDto>>> GetGameRules(int id)
        {
            try
            {
                var rules = await _service.GetGameRulesAsync(id);
                if (rules == null || rules.Count == 0)
                {
                    return NotFound();
                }

                return Ok(rules);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving game rules.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<GameDefinitionDto>> CreateGame(CreateGameDto dto)
        {
            try
            {
                var game = await _service.CreateGameAsync(dto);
                return CreatedAtAction(nameof(GetGame), new { id = game!.Id }, game);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the game.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            try
            {
                var deleted = await _service.DeleteGameAsync(id);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the game.");
            }
        }
    }
} 