using FluentAssertions;
using FizzBuzzGameApi.Services;
using FizzBuzzGameApi.Models.DTOs;
using FizzBuzzGameApi.Data;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace FizzBuzzGameApi.Tests.Services;

public class FizzBuzzServiceTests
{
    private readonly FizzBuzzService _service;
    private readonly FizzBuzzDbContext _dbContext;

    public FizzBuzzServiceTests()
    {
        var options = new DbContextOptionsBuilder<FizzBuzzDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _dbContext = new FizzBuzzDbContext(options);
        _service = new FizzBuzzService(_dbContext);
    }

    [Fact]
    public async Task CreateGameAsync_WithValidRequest_ShouldReturnValidGameDefinition()
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

        // Act
        var result = await _service.CreateGameAsync(request);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be(request.Name);
        result.Author.Should().Be(request.Author);
        result.MinNumber.Should().Be(request.MinNumber);
        result.MaxNumber.Should().Be(request.MaxNumber);
        result.Rules.Should().HaveCount(2);
    }

    [Fact]
    public async Task CreateGameAsync_WithInvalidNumberRange_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new CreateGameDto
        {
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 100,
            MaxNumber = 1, // Invalid: max < min
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" }
            }
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateGameAsync(request));
    }

    [Fact]
    public async Task CreateGameAsync_WithEmptyName_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new CreateGameDto
        {
            Name = "",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto>
            {
                new() { Divisor = 3, Word = "Fizz" }
            }
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateGameAsync(request));
    }

    [Fact]
    public async Task CreateGameAsync_WithNoRules_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new CreateGameDto
        {
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto>()
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateGameAsync(request));
    }

    [Fact]
    public async Task GetGamesAsync_ShouldReturnAllGames()
    {
        // Arrange
        var game1 = new CreateGameDto
        {
            Name = "Game 1",
            Author = "Author 1",
            MinNumber = 1,
            MaxNumber = 50,
            Rules = new List<GameRuleDto> { new() { Divisor = 2, Word = "Even" } }
        };

        var game2 = new CreateGameDto
        {
            Name = "Game 2",
            Author = "Author 2",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto> { new() { Divisor = 3, Word = "Fizz" } }
        };

        await _service.CreateGameAsync(game1);
        await _service.CreateGameAsync(game2);

        // Act
        var result = await _service.GetGamesAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(g => g.Name == "Game 1");
        result.Should().Contain(g => g.Name == "Game 2");
    }

    [Fact]
    public async Task GetGameAsync_WithValidId_ShouldReturnGame()
    {
        // Arrange
        var game = new CreateGameDto
        {
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto> { new() { Divisor = 3, Word = "Fizz" } }
        };

        var createdGame = await _service.CreateGameAsync(game);

        // Act
        var result = await _service.GetGameAsync(createdGame!.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Test Game");
    }

    [Fact]
    public async Task GetGameAsync_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _service.GetGameAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetGameRulesAsync_WithValidId_ShouldReturnRules()
    {
        // Arrange
        var game = new CreateGameDto
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

        var createdGame = await _service.CreateGameAsync(game);

        // Act
        var result = await _service.GetGameRulesAsync(createdGame!.Id);

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(r => r.Word == "Fizz");
        result.Should().Contain(r => r.Word == "Buzz");
    }

    [Fact]
    public async Task DeleteGameAsync_WithValidId_ShouldReturnTrue()
    {
        // Arrange
        var game = new CreateGameDto
        {
            Name = "Test Game",
            Author = "Test Author",
            MinNumber = 1,
            MaxNumber = 100,
            Rules = new List<GameRuleDto> { new() { Divisor = 3, Word = "Fizz" } }
        };

        var createdGame = await _service.CreateGameAsync(game);

        // Act
        var result = await _service.DeleteGameAsync(createdGame!.Id);

        // Assert
        result.Should().BeTrue();
        var deletedGame = await _service.GetGameAsync(createdGame.Id);
        deletedGame.Should().BeNull();
    }

    [Fact]
    public async Task DeleteGameAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Act
        var result = await _service.DeleteGameAsync(999);

        // Assert
        result.Should().BeFalse();
    }
} 