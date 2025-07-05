using FizzBuzzGameApi.Models;

namespace FizzBuzzGameApi.Models.DTOs
{
    public class StartSessionDto
    {
        public int GameDefinitionId { get; set; }

        public int DurationSeconds { get; set; }
    }
} 