using FizzBuzzGameApi.Models.DTOs;

namespace FizzBuzzGameApi.Services
{
    public interface ISessionService
    {
        Task<SessionStateDto?> StartSessionAsync(StartSessionDto dto);
        Task<SessionStateDto?> SubmitAnswerAsync(int sessionId, SubmitAnswerDto dto);
        Task<SessionStateDto?> GetSessionAsync(int sessionId);
    }
} 