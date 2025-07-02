using FizzBuzzGameApi.Models;

namespace FizzBuzzGameApi.Models.DTOs
{
    public class CreateGameDto
    {
        public string name { get; set; } = string.Empty;
        public string author { get; set; } = string.Empty;
        public int minNumber { get; set; }
        public int maxNumber { get; set; }
        public List<GameRuleDto> rules { get; set; } = new();
    }

    public class GameDefinitionDto
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public string author { get; set; } = string.Empty;
        public int minNumber { get; set; }
        public int maxNumber { get; set; }
        public List<GameRuleDto> rules { get; set; } = new();
        public GameDefinitionDto() { }
        public GameDefinitionDto(FizzBuzzGameApi.Models.GameDefinition g)
        {
            id = g.Id;
            name = g.Name;
            author = g.Author;
            minNumber = g.MinNumber;
            maxNumber = g.MaxNumber;
            rules = g.Rules.Select(r => new GameRuleDto(r)).ToList();
        }
    }

    public class GameRuleDto
    {
        public int divisor { get; set; }
        public string word { get; set; } = string.Empty;
        public GameRuleDto() { }
        public GameRuleDto(FizzBuzzGameApi.Models.GameRule r)
        {
            divisor = r.Divisor;
            word = r.Word;
        }
    }
} 