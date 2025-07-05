using FizzBuzzGameApi.Models;

namespace FizzBuzzGameApi.Models.DTOs
{
    public class CreateGameDto
    {
        public string Name { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        public int MinNumber { get; set; }

        public int MaxNumber { get; set; }

        public List<GameRuleDto> Rules { get; set; } = new();
    }
} 