using FluentAssertions;
using FizzBuzzGameApi.Controllers;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace FizzBuzzGameApi.Tests.Controllers;

public class GameControllerTests
{
    private readonly Mock<IFizzBuzzService> _mockFizzBuzzService;
    private readonly GameController _controller;

    public GameControllerTests()
    {
        _mockFizzBuzzService = new Mock<IFizzBuzzService>();
        _controller = new GameController(_mockFizzBuzzService.Object);
    }

    [Fact]
    public async Task CreateGame_WithValidRequest_ShouldReturnCreatedResult()
    {
        // Arrange
        var request = new CreateGameDto
        {
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" },
                new() { Divisor = 5, Word = "Buzz" }
            }
        };

        var expectedGame = new GameDefinitionDto
        {
            Id = 1,
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" },
                new() { Divisor = 5, Word = "Buzz" }
            }
        };

        _mockFizzBuzzService
            .Setup(x => x.CreateGameAsync(request))
            .ReturnsAsync(expectedGame);

        // Act
        var result = await _controller.CreateGame(request);

        // Assert
        result.Result.Should().BeOfType<CreatedAtActionResult>();
        var createdResult = result.Result as CreatedAtActionResult;
        createdResult!.Value.Should().BeEquivalentTo(expectedGame);
    }

    [Fact]
    public async Task CreateGame_WithInvalidRequest_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new CreateGameDto
        {
            Name = "",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto> { new() { Divisor = 3, Word = "Fizz" } }
        };

        _mockFizzBuzzService
            .Setup(x => x.CreateGameAsync(request))
            .ThrowsAsync(new ArgumentException("Name is required"));

        // Act
        var result = await _controller.CreateGame(request);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GetGame_WithValidId_ShouldReturnOkResult()
    {
        // Arrange
        var gameId = 1;
        var expectedGame = new GameDefinitionDto
        {
            Id = gameId,
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto> { new() { Divisor = 3, Word = "Fizz" } }
        };

        _mockFizzBuzzService
            .Setup(x => x.GetGameAsync(gameId))
            .ReturnsAsync(expectedGame);

        // Act
        var result = await _controller.GetGame(gameId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedGame);
    }

    [Fact]
    public async Task GetGame_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var gameId = 999;

        _mockFizzBuzzService
            .Setup(x => x.GetGameAsync(gameId))
            .ReturnsAsync((GameDefinitionDto?)null);

        // Act
        var result = await _controller.GetGame(gameId);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task GetGames_ShouldReturnOkResult()
    {
        // Arrange
        var expectedGames = new List<GameDefinitionDto>
        {
            new() { Id = 1, Name = "Game 1", Author = "Author 1", MinNumber = 1, MaxNumber = 50 },
            new() { Id = 2, Name = "Game 2", Author = "Author 2", MinNumber = 1, MaxNumber = 100 }
        };

        _mockFizzBuzzService
            .Setup(x => x.GetGamesAsync())
            .ReturnsAsync(expectedGames);

        // Act
        var result = await _controller.GetGames();

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedGames);
    }

    [Fact]
    public async Task GetGameRules_WithValidId_ShouldReturnOkResult()
    {
        // Arrange
        var gameId = 1;
        var expectedRules = new List<GameRuleDto>
        {
            new() { Divisor = 3, Word = "Fizz" },
            new() { Divisor = 5, Word = "Buzz" }
        };

        _mockFizzBuzzService
            .Setup(x => x.GetGameRulesAsync(gameId))
            .ReturnsAsync(expectedRules);

        // Act
        var result = await _controller.GetGameRules(gameId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedRules);
    }

    [Fact]
    public async Task GetGameRules_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var gameId = 999;

        _mockFizzBuzzService
            .Setup(x => x.GetGameRulesAsync(gameId))
            .ReturnsAsync(new List<GameRuleDto>());

        // Act
        var result = await _controller.GetGameRules(gameId);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task DeleteGame_WithValidId_ShouldReturnNoContent()
    {
        // Arrange
        var gameId = 1;

        _mockFizzBuzzService
            .Setup(x => x.DeleteGameAsync(gameId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteGame(gameId);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteGame_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var gameId = 999;

        _mockFizzBuzzService
            .Setup(x => x.DeleteGameAsync(gameId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteGame(gameId);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }
} 