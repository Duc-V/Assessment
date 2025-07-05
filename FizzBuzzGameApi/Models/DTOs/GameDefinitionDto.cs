using FizzBuzzGameApi.Models;

namespace FizzBuzzGameApi.Models.DTOs
{
    public class GameDefinitionDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        public int MinNumber { get; set; }

        public int MaxNumber { get; set; }

        public List<GameRuleDto> Rules { get; set; } = new();

        public GameDefinitionDto()
        {
        }

        public GameDefinitionDto(FizzBuzzGameApi.Models.GameDefinition g)
        {
            Id = g.Id;
            Name = g.Name;
            Author = g.Author;
            MinNumber = g.MinNumber;
            MaxNumber = g.MaxNumber;
            Rules = g.Rules.Select(r => new GameRuleDto(r)).ToList();
        }
    }
} 