# FizzBuzz Game API & Frontend

A full-stack web application featuring a customizable FizzBuzz game with a .NET 8 Web API backend and Next.js 15 frontend.

## 🏗️ Architecture

### Backend (.NET 8 Web API)
- **Framework**: ASP.NET Core 8.0
- **Database**: SQLite with Entity Framework Core
- **Architecture**: Clean Architecture with Services and Controllers
- **Testing**: xUnit with Moq and FluentAssertions

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Testing**: Jest with React Testing Library

## 📁 Project Structure

```
FinalAssessment/
├── FizzBuzzGameApi/                 # Backend API
│   ├── Controllers/                 # API Controllers
│   ├── Data/                       # Entity Framework Context
│   ├── Models/                     # Domain Models & DTOs
│   ├── Services/                   # Business Logic Services
│   ├── Migrations/                 # Database Migrations
│   └── FizzBuzzGameApi.Tests/      # Backend Tests
├── fizzbuzz-frontend/              # Frontend Application
│   ├── src/
│   │   ├── apis/                   # API Client Functions
│   │   ├── app/                    # Next.js App Router
│   │   ├── components/             # Reusable UI Components
│   │   └── __tests__/              # Frontend Tests
│   └── public/                     # Static Assets
├── docker-compose.yml              # Docker Orchestration
└── README.md                       # This File
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- .NET 8 SDK (for local development)
- Node.js 20+ (for local development)

### Using Docker (Recommended)
1. Clone the repository
2. Run the entire stack:
   ```bash
   docker-compose up --build
   ```
3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/swagger

### Local Development

#### Backend Setup
```bash
cd FizzBuzzGameApi
dotnet restore
dotnet ef database update
dotnet run
```

#### Frontend Setup
```bash
cd fizzbuzz-frontend
npm install
npm run dev
```

## 🎮 Game Features

### Game Creation
- Create custom FizzBuzz games with multiple rules
- Define number ranges and custom words for divisors
- Support for complex rule combinations

### Game Sessions
- Start timed game sessions
- Real-time score tracking
- Session state management

### API Endpoints

#### Games
- `GET /api/game` - List all games
- `GET /api/game/{id}` - Get specific game
- `GET /api/game/{id}/rules` - Get game rules
- `POST /api/game` - Create new game
- `DELETE /api/game/{id}` - Delete game

#### Sessions
- `POST /api/session` - Start new session
- `GET /api/session/{id}` - Get session state
- `POST /api/session/{id}/answer` - Submit answer

## 🧪 Testing

### Backend Tests
```bash
cd FizzBuzzGameApi.Tests
dotnet test
```

#### Test Coverage
- **Unit Tests**: Service layer business logic
- **Integration Tests**: Controller endpoints
- **Test Frameworks**: xUnit, Moq, FluentAssertions

### Frontend Tests
```bash
cd fizzbuzz-frontend
npm test
```

#### Test Coverage
- **Component Tests**: UI component behavior
- **Integration Tests**: Page functionality
- **Test Frameworks**: Jest, React Testing Library

## 🗄️ Database

### Schema
- **GameDefinitions**: Game configurations
- **GameRules**: Individual rules for each game
- **GameSessions**: Active game sessions
- **GameAnswers**: Session answer history

### Migrations
```bash
cd FizzBuzzGameApi
dotnet ef migrations add MigrationName
dotnet ef database update
```

## 🔧 Configuration

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `ConnectionStrings__DefaultConnection`: Database connection string

### Docker Configuration
- Database persistence through Docker volumes
- Shared database file for development team collaboration
- Hot reload for both frontend and backend

## 📊 API Documentation

The API includes comprehensive Swagger documentation available at:
- http://localhost:5000/swagger (when running)

### Example API Usage

#### Create a Game
```bash
curl -X POST "http://localhost:5000/api/game" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic FizzBuzz",
    "author": "Developer",
    "minNumber": 1,
    "maxNumber": 100,
    "rules": [
      {"divisor": 3, "word": "Fizz"},
      {"divisor": 5, "word": "Buzz"}
    ]
  }'
```

#### Start a Session
```bash
curl -X POST "http://localhost:5000/api/session" \
  -H "Content-Type: application/json" \
  -d '{
    "gameDefinitionId": 1,
    "durationSeconds": 60
  }'
```

## 🛠️ Development Guidelines

### Code Style
- **Backend**: Follow C# coding conventions
- **Frontend**: Use TypeScript strict mode
- **Components**: Functional components with hooks
- **API**: RESTful design principles

### Testing Strategy
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and component interactions
- **Coverage**: Aim for >80% test coverage

### Git Workflow
- Feature branches for new development
- Pull requests for code review
- Semantic commit messages

## 🚀 Deployment

### Production Build
```bash
# Backend
cd FizzBuzzGameApi
dotnet publish -c Release

# Frontend
cd fizzbuzz-frontend
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Note**: This project is designed for educational purposes and demonstrates modern full-stack development practices with .NET and React.
