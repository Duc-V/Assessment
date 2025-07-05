using FizzBuzzGameApi.Models;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Data;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzzGameApi.Services
{
    public class FizzBuzzService : IFizzBuzzService
    {
        private readonly FizzBuzzDbContext _db;

        public FizzBuzzService(FizzBuzzDbContext db)
        {
            _db = db;
        }

        public async Task<List<GameDefinitionDto>> GetGamesAsync()
        {
            try
            {
                var games = await _db.GameDefinitions.Include(g => g.Rules).ToListAsync();
                return games.Select(g => new GameDefinitionDto(g)).ToList();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to retrieve games from database.", ex);
            }
        }

        public async Task<GameDefinitionDto?> GetGameAsync(int id)
        {
            try
            {
                var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);
                return game == null ? null : new GameDefinitionDto(game);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to retrieve game with ID {id} from database.", ex);
            }
        }

        public async Task<List<GameRuleDto>> GetGameRulesAsync(int id)
        {
            try
            {
                var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);
                return game == null ? new List<GameRuleDto>() : game.Rules.Select(r => new GameRuleDto(r)).ToList();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to retrieve rules for game with ID {id} from database.", ex);
            }
        }

        public async Task<GameDefinitionDto?> CreateGameAsync(CreateGameDto dto)
        {
            try
            {
                if (dto.MinNumber < 0 || dto.MaxNumber < dto.MinNumber)
                {
                    throw new ArgumentException("Invalid number range.");
                }

                if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Author))
                {
                    throw new ArgumentException("Name and Author are required.");
                }

                if (dto.Rules == null || dto.Rules.Count == 0)
                {
                    throw new ArgumentException("At least one rule is required.");
                }

                if (await _db.GameDefinitions.AnyAsync(g => g.Name == dto.Name))
                {
                    throw new InvalidOperationException("Game name must be unique.");
                }

                var game = new GameDefinition
                {
                    Name = dto.Name,
                    Author = dto.Author,
                    MinNumber = dto.MinNumber,
                    MaxNumber = dto.MaxNumber,
                    Rules = dto.Rules.Select(r => new GameRule { Divisor = r.Divisor, Word = r.Word }).ToList()
                };

                _db.GameDefinitions.Add(game);
                await _db.SaveChangesAsync();
                return new GameDefinitionDto(game);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to create game in database.", ex);
            }
        }

        public async Task<bool> DeleteGameAsync(int id)
        {
            try
            {
                var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);
                if (game == null)
                {
                    return false;
                }

                var sessions = _db.GameSessions.Where(s => s.GameDefinitionId == id);
                _db.GameSessions.RemoveRange(sessions);
                _db.GameRules.RemoveRange(game.Rules);
                _db.GameDefinitions.Remove(game);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to delete game with ID {id} from database.", ex);
            }
        }
    }
} 