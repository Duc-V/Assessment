using FluentAssertions;
using FizzBuzzGameApi.Controllers;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace FizzBuzzGameApi.Tests.Controllers;

public class SessionControllerTests
{
    private readonly Mock<ISessionService> _mockSessionService;
    private readonly SessionController _controller;

    public SessionControllerTests()
    {
        _mockSessionService = new Mock<ISessionService>();
        _controller = new SessionController(_mockSessionService.Object);
    }

    [Fact]
    public async Task StartSession_WithValidRequest_ShouldReturnOkResult()
    {
        // Arrange
        var request = new StartSessionDto
        {
            GameDefinitionId = 1,
            DurationSeconds = 60
        };

        var expectedSession = new SessionStateDto
        {
            SessionId = 1,
            GameDefinitionId = 1,
            ScoreCorrect = 0,
            ScoreIncorrect = 0,
            NextNumber = 1,
            TimeLeftSeconds = 60,
            Ended = false,
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" },
                new() { Divisor = 5, Word = "Buzz" }
            }
        };

        _mockSessionService
            .Setup(x => x.StartSessionAsync(request))
            .ReturnsAsync(expectedSession);

        // Act
        var result = await _controller.StartSession(request);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedSession);
    }

    [Fact]
    public async Task StartSession_WithInvalidGameId_ShouldReturnNotFound()
    {
        // Arrange
        var request = new StartSessionDto
        {
            GameDefinitionId = 999,
            DurationSeconds = 60
        };

        _mockSessionService
            .Setup(x => x.StartSessionAsync(request))
            .ReturnsAsync((SessionStateDto?)null);

        // Act
        var result = await _controller.StartSession(request);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetSession_WithValidId_ShouldReturnOkResult()
    {
        // Arrange
        var sessionId = 1;
        var expectedSession = new SessionStateDto
        {
            SessionId = sessionId,
            GameDefinitionId = 1,
            ScoreCorrect = 5,
            ScoreIncorrect = 2,
            NextNumber = 8,
            TimeLeftSeconds = 45,
            Ended = false,
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" }
            }
        };

        _mockSessionService
            .Setup(x => x.GetSessionAsync(sessionId))
            .ReturnsAsync(expectedSession);

        // Act
        var result = await _controller.GetSession(sessionId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedSession);
    }

    [Fact]
    public async Task GetSession_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var sessionId = 999;

        _mockSessionService
            .Setup(x => x.GetSessionAsync(sessionId))
            .ReturnsAsync((SessionStateDto?)null);

        // Act
        var result = await _controller.GetSession(sessionId);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task SubmitAnswer_WithValidRequest_ShouldReturnOkResult()
    {
        // Arrange
        var sessionId = 1;
        var request = new SubmitAnswerDto
        {
            Answer = "Fizz"
        };

        var expectedSession = new SessionStateDto
        {
            SessionId = sessionId,
            GameDefinitionId = 1,
            ScoreCorrect = 6,
            ScoreIncorrect = 2,
            NextNumber = 9,
            TimeLeftSeconds = 40,
            Ended = false,
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" }
            }
        };

        _mockSessionService
            .Setup(x => x.SubmitAnswerAsync(sessionId, request))
            .ReturnsAsync(expectedSession);

        // Act
        var result = await _controller.SubmitAnswer(sessionId, request);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedSession);
    }

    [Fact]
    public async Task SubmitAnswer_WithInvalidSessionId_ShouldReturnNotFound()
    {
        // Arrange
        var sessionId = 999;
        var request = new SubmitAnswerDto
        {
            Answer = "Fizz"
        };

        _mockSessionService
            .Setup(x => x.SubmitAnswerAsync(sessionId, request))
            .ReturnsAsync((SessionStateDto?)null);

        // Act
        var result = await _controller.SubmitAnswer(sessionId, request);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }
} 