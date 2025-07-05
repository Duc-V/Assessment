# Testing Guide

This document provides comprehensive information about testing the FizzBuzz Game API & Frontend project.

## 🧪 Backend Testing (.NET)

### Test Structure
```
FizzBuzzGameApi.Tests/
├── Controllers/
│   ├── GameControllerTests.cs      # API endpoint tests
│   └── SessionControllerTests.cs   # Session management tests
└── Services/
    └── FizzBuzzServiceTests.cs     # Business logic tests
```

### Running Backend Tests

#### Prerequisites
- .NET 8 SDK installed
- All NuGet packages restored

#### Commands
```bash
# Run all tests
cd FizzBuzzGameApi.Tests
dotnet test

# Run with verbose output
dotnet test --verbosity normal

# Run specific test class
dotnet test --filter "FullyQualifiedName~FizzBuzzServiceTests"

# Run with coverage (requires coverlet.collector)
dotnet test --collect:"XPlat Code Coverage"
```

### Test Coverage

#### Unit Tests
- **FizzBuzzService**: Tests business logic for game creation, retrieval, and deletion
- **Validation**: Tests input validation and error handling
- **Database Operations**: Tests CRUD operations with in-memory database

#### Integration Tests
- **GameController**: Tests API endpoints for game management
- **SessionController**: Tests session lifecycle and answer submission
- **HTTP Responses**: Tests correct status codes and response formats

### Test Examples

#### Service Test Example
```csharp
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
    result.Rules.Should().HaveCount(2);
}
```

#### Controller Test Example
```csharp
[Fact]
public async Task CreateGame_WithValidRequest_ShouldReturnCreatedResult()
{
    // Arrange
    var request = new CreateGameDto { /* ... */ };
    var expectedGame = new GameDefinitionDto { /* ... */ };

    _mockFizzBuzzService
        .Setup(x => x.CreateGameAsync(request))
        .ReturnsAsync(expectedGame);

    // Act
    var result = await _controller.CreateGame(request);

    // Assert
    result.Should().BeOfType<CreatedAtActionResult>();
}
```

## 🧪 Frontend Testing (Next.js)

### Test Structure
```
fizzbuzz-frontend/
├── jest.config.js                  # Jest configuration
├── jest.setup.js                   # Test environment setup
└── src/
    └── __tests__/                  # Test files
        └── components/             # Component tests
```

### Setting Up Frontend Tests

#### 1. Install Dependencies
```bash
cd fizzbuzz-frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

#### 2. Configuration Files

**jest.config.js**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**jest.setup.js**
```javascript
import '@testing-library/jest-dom'
```

#### 3. Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Examples

#### Component Test Example
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoadingScreen from '../components/LoadingScreen'

describe('LoadingScreen', () => {
  it('renders loading message', () => {
    render(<LoadingScreen message="Loading games..." />)
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument()
  })

  it('renders default message when no message provided', () => {
    render(<LoadingScreen />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
```

#### API Test Example
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import GameList from '../components/GameList'

const server = setupServer(
  rest.get('/api/game', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Test Game', author: 'Test Author' }
    ]))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('GameList', () => {
  it('loads and displays games', async () => {
    render(<GameList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument()
    })
  })
})
```

## 🎯 Testing Best Practices

### Backend Testing
1. **Use In-Memory Database**: Use EF Core InMemory provider for tests
2. **Mock External Dependencies**: Use Moq for service dependencies
3. **Test Edge Cases**: Include validation and error scenarios
4. **Async/Await**: Always use async/await for async operations
5. **Descriptive Names**: Use descriptive test method names

### Frontend Testing
1. **Test User Behavior**: Focus on user interactions, not implementation
2. **Use Testing Library**: Prefer Testing Library over Enzyme
3. **Mock API Calls**: Use MSW or jest.mock for API testing
4. **Accessibility**: Test for accessibility features
5. **Component Isolation**: Test components in isolation

### General Guidelines
1. **Arrange-Act-Assert**: Follow the AAA pattern
2. **One Assertion Per Test**: Keep tests focused and simple
3. **Meaningful Test Data**: Use realistic test data
4. **Test Coverage**: Aim for >80% coverage
5. **Fast Tests**: Keep tests fast and reliable

## 🔧 Troubleshooting

### Common Backend Issues
- **Database Connection**: Ensure in-memory database is configured
- **Async Tests**: Make sure to await async operations
- **Mock Setup**: Verify mock configurations are correct

### Common Frontend Issues
- **Module Resolution**: Check Jest module mapping
- **Environment Setup**: Ensure jsdom environment is configured
- **TypeScript**: Verify @types/jest is installed

### Performance
- **Test Isolation**: Each test should be independent
- **Cleanup**: Properly clean up after each test
- **Parallel Execution**: Use parallel test execution when possible

## 📊 Coverage Reports

### Backend Coverage
```bash
# Generate coverage report
dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage

# View coverage (requires ReportGenerator)
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:./coverage/coverage.opencover.xml -targetdir:./coverage/report
```

### Frontend Coverage
```bash
# Generate coverage report
npm run test:coverage

# Coverage report will be available in coverage/lcov-report/index.html
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - run: dotnet test FizzBuzzGameApi.Tests

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
```

---

For more information about testing frameworks:
- [xUnit Documentation](https://xunit.net/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 