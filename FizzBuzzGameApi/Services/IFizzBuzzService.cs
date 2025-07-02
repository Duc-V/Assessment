using FizzBuzzGameApi.Models;
using FizzBuzzGameApi.Models.DTOs;

namespace FizzBuzzGameApi.Services
{
    public interface IFizzBuzzService
    {
        Task<List<GameDefinitionDto>> GetGamesAsync();
        Task<GameDefinitionDto?> GetGameAsync(int id);
        Task<List<GameRuleDto>> GetGameRulesAsync(int id);
        Task<GameDefinitionDto?> CreateGameAsync(CreateGameDto dto);
        Task<bool> DeleteGameAsync(int id);
    }
} 