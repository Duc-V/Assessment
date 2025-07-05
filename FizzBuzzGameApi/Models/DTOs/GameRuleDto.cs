using FizzBuzzGameApi.Models;

namespace FizzBuzzGameApi.Models.DTOs
{
    public class GameRuleDto
    {
        public int Divisor { get; set; }

        public string Word { get; set; } = string.Empty;

        public GameRuleDto()
        {
        }

        public GameRuleDto(FizzBuzzGameApi.Models.GameRule r)
        {
            Divisor = r.Divisor;
            Word = r.Word;
        }
    }
} 