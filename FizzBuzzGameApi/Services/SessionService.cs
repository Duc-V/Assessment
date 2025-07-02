using FizzBuzzGameApi.Models;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace FizzBuzzGameApi.Services
{
    public class SessionService : ISessionService
    {
        private readonly FizzBuzzDbContext _db;
        private readonly Random _random = new();
        public SessionService(FizzBuzzDbContext db) => _db = db;

        public async Task<SessionStateDto?> StartSessionAsync(StartSessionDto dto)
        {
            var game = await _db.GameDefinitions.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == dto.GameDefinitionId);
            if (game == null) return null;
            var session = new GameSession
            {
                GameDefinitionId = game.Id,
                StartTime = DateTime.UtcNow,
                DurationSeconds = dto.DurationSeconds,
                ScoreCorrect = 0,
                ScoreIncorrect = 0,
                NumbersServed = "[]"
            };
            var numbersServed = new List<int>();
            var nextNumber = GetNextNumber(game, numbersServed);
            session.NumbersServed = JsonSerializer.Serialize(numbersServed);
            _db.GameSessions.Add(session);
            await _db.SaveChangesAsync();
            return new SessionStateDto(session, nextNumber, game);
        }

        public async Task<SessionStateDto?> SubmitAnswerAsync(int id, SubmitAnswerDto dto)
        {
            var session = await _db.GameSessions.Include(s => s.GameDefinition).ThenInclude(g => g.Rules).FirstOrDefaultAsync(s => s.Id == id);
            if (session == null) return null;
            var game = session.GameDefinition!;
            var numbersServed = JsonSerializer.Deserialize<List<int>>(session.NumbersServed) ?? new List<int>();
            // Check answer
            int lastNumber = numbersServed.Count > 0 ? numbersServed.Last() : -1;
            var expected = FizzBuzzAnswer(lastNumber, game.Rules);
            if (dto.Answer.Trim().Equals(expected.Trim(), StringComparison.OrdinalIgnoreCase))
                session.ScoreCorrect++;
            else
                session.ScoreIncorrect++;
            // Next number
            var nextNumber = GetNextNumber(game, numbersServed);
            session.NumbersServed = JsonSerializer.Serialize(numbersServed);
            await _db.SaveChangesAsync();
            // Check if time is up or all numbers served after answer
            var now = DateTime.UtcNow;
            if ((now - session.StartTime).TotalSeconds > session.DurationSeconds || numbersServed.Count >= (game.MaxNumber - game.MinNumber + 1) || nextNumber == null)
                return new SessionStateDto(session, null, game, ended:true);
            return new SessionStateDto(session, nextNumber, game);
        }

        public async Task<SessionStateDto?> GetSessionAsync(int id)
        {
            var session = await _db.GameSessions.Include(s => s.GameDefinition).ThenInclude(g => g.Rules).FirstOrDefaultAsync(s => s.Id == id);
            if (session == null) return null;
            var game = session.GameDefinition!;
            var numbersServed = JsonSerializer.Deserialize<List<int>>(session.NumbersServed) ?? new List<int>();
            int? nextNumber = null;
            if (numbersServed.Count < (game.MaxNumber - game.MinNumber + 1))
                nextNumber = GetNextNumber(game, numbersServed);
            var now = DateTime.UtcNow;
            var ended = (now - session.StartTime).TotalSeconds > session.DurationSeconds;
            return new SessionStateDto(session, nextNumber, game, ended);
        }

        private int? GetNextNumber(GameDefinition game, List<int> numbersServed)
        {
            var allNumbers = Enumerable.Range(game.MinNumber, game.MaxNumber - game.MinNumber + 1).Except(numbersServed).ToList();
            if (!allNumbers.Any()) return null;
            var next = allNumbers[_random.Next(allNumbers.Count)];
            numbersServed.Add(next);
            return next;
        }

        private string FizzBuzzAnswer(int number, List<GameRule> rules)
        {
            var result = string.Join("", rules.Where(r => number % r.Divisor == 0).Select(r => r.Word));
            return string.IsNullOrEmpty(result) ? number.ToString() : result;
        }
    }
} 