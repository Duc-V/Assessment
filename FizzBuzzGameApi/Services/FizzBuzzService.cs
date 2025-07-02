using FizzBuzzGameApi.Models;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Data;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzzGameApi.Services
{
    public class FizzBuzzService : IFizzBuzzService
    {
        private readonly FizzBuzzDbContext _db;
        public FizzBuzzService(FizzBuzzDbContext db) => _db = db;

        public async Task<List<GameDefinitionDto>> GetGamesAsync()
        {
            var games = await _db.GameDefinitions.Include(g => g.Rules).ToListAsync();
            return games.Select(g => new GameDefinitionDto(g)).ToList();
        }

        public async Task<GameDefinitionDto?> GetGameAsync(int id)
        {
            var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);
            return game == null ? null : new GameDefinitionDto(game);
        }

        public async Task<List<GameRuleDto>> GetGameRulesAsync(int id)
        {
            var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);
            return game == null ? new List<GameRuleDto>() : game.Rules.Select(r => new GameRuleDto(r)).ToList();
        }

        public async Task<GameDefinitionDto?> CreateGameAsync(CreateGameDto dto)
        {
            if (dto.minNumber < 0 || dto.maxNumber < dto.minNumber)
                throw new ArgumentException("Invalid number range.");
            if (string.IsNullOrWhiteSpace(dto.name) || string.IsNullOrWhiteSpace(dto.author))
                throw new ArgumentException("Name and Author are required.");
            if (dto.rules == null || dto.rules.Count == 0)
                throw new ArgumentException("At least one rule is required.");
            if (await _db.GameDefinitions.AnyAsync(g => g.Name == dto.name))
                throw new InvalidOperationException("Game name must be unique.");
            var game = new GameDefinition
            {
                Name = dto.name,
                Author = dto.author,
                MinNumber = dto.minNumber,
                MaxNumber = dto.maxNumber,
                Rules = dto.rules.Select(r => new GameRule { Divisor = r.divisor, Word = r.word }).ToList()
            };
            _db.GameDefinitions.Add(game);
            await _db.SaveChangesAsync();
            return new GameDefinitionDto(game);
        }

        public async Task<bool> DeleteGameAsync(int id)
        {
            var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);
            if (game == null) return false;
            var sessions = _db.GameSessions.Where(s => s.GameDefinitionId == id);
            _db.GameSessions.RemoveRange(sessions);
            _db.GameRules.RemoveRange(game.Rules);
            _db.GameDefinitions.Remove(game);
            await _db.SaveChangesAsync();
            return true;
        }
    }
} 