namespace FizzBuzzGameApi.Models
{
    public class GameDefinition
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int MinNumber { get; set; }
        public int MaxNumber { get; set; }
        public List<GameRule> Rules { get; set; } = new();
    }

    public class GameRule
    {
        public int Id { get; set; }
        public int GameDefinitionId { get; set; }
        public int Divisor { get; set; }
        public string Word { get; set; } = string.Empty;
        public GameDefinition? GameDefinition { get; set; }
    }

    public class GameSession
    {
        public int Id { get; set; }
        public int GameDefinitionId { get; set; }
        public GameDefinition? GameDefinition { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationSeconds { get; set; }
        public int ScoreCorrect { get; set; }
        public int ScoreIncorrect { get; set; }
        public string NumbersServed { get; set; } = string.Empty; // JSON array of int
    }
} 