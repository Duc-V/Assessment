using FizzBuzzGameApi.Models;

namespace FizzBuzzGameApi.Models.DTOs
{
    public class SessionStateDto
    {
        public int SessionId { get; set; }

        public int GameDefinitionId { get; set; }

        public int ScoreCorrect { get; set; }

        public int ScoreIncorrect { get; set; }

        public int? NextNumber { get; set; }

        public int TimeLeftSeconds { get; set; }

        public bool Ended { get; set; }

        public List<GameRuleDto> Rules { get; set; } = new();

        public SessionStateDto()
        {
        }

        public SessionStateDto(FizzBuzzGameApi.Models.GameSession s, int? nextNumber, FizzBuzzGameApi.Models.GameDefinition g, bool ended = false)
        {
            SessionId = s.Id;
            GameDefinitionId = g.Id;
            ScoreCorrect = s.ScoreCorrect;
            ScoreIncorrect = s.ScoreIncorrect;
            NextNumber = nextNumber;
            TimeLeftSeconds = Math.Max(0, s.DurationSeconds - (int)(DateTime.UtcNow - s.StartTime).TotalSeconds);
            Ended = ended;
            Rules = g.Rules.Select(r => new GameRuleDto(r)).ToList();
        }
    }
} 