# FizzBuzz Game API Documentation

## Overview

The FizzBuzz Game API is a RESTful web service built with ASP.NET Core 8.0 that provides endpoints for creating, managing, and playing customizable FizzBuzz games.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Data Models

### GameDefinitionDto
```json
{
  "id": 1,
  "name": "Classic FizzBuzz",
  "author": "Developer",
  "minNumber": 1,
  "maxNumber": 100,
  "rules": [
    {
      "divisor": 3,
      "word": "Fizz"
    },
    {
      "divisor": 5,
      "word": "Buzz"
    }
  ]
}
```

### CreateGameDto
```json
{
  "name": "Classic FizzBuzz",
  "author": "Developer",
  "minNumber": 1,
  "maxNumber": 100,
  "rules": [
    {
      "divisor": 3,
      "word": "Fizz"
    },
    {
      "divisor": 5,
      "word": "Buzz"
    }
  ]
}
```

### GameRuleDto
```json
{
  "divisor": 3,
  "word": "Fizz"
}
```

### SessionStateDto
```json
{
  "sessionId": 1,
  "gameDefinitionId": 1,
  "scoreCorrect": 5,
  "scoreIncorrect": 2,
  "nextNumber": 8,
  "timeLeftSeconds": 45,
  "ended": false,
  "rules": [
    {
      "divisor": 3,
      "word": "Fizz"
    }
  ]
}
```

### StartSessionDto
```json
{
  "gameDefinitionId": 1,
  "durationSeconds": 60
}
```

### SubmitAnswerDto
```json
{
  "answer": "Fizz"
}
```

## Endpoints

### Games

#### GET /api/game
Retrieves all available games.

**Response**
- **200 OK**: List of games
```json
[
  {
    "id": 1,
    "name": "Classic FizzBuzz",
    "author": "Developer",
    "minNumber": 1,
    "maxNumber": 100,
    "rules": [...]
  }
]
```

#### GET /api/game/{id}
Retrieves a specific game by ID.

**Parameters**
- `id` (int): Game ID

**Response**
- **200 OK**: Game details
- **404 Not Found**: Game not found

#### GET /api/game/{id}/rules
Retrieves rules for a specific game.

**Parameters**
- `id` (int): Game ID

**Response**
- **200 OK**: List of game rules
- **404 Not Found**: Game not found

#### POST /api/game
Creates a new game.

**Request Body**
```json
{
  "name": "Classic FizzBuzz",
  "author": "Developer",
  "minNumber": 1,
  "maxNumber": 100,
  "rules": [
    {
      "divisor": 3,
      "word": "Fizz"
    },
    {
      "divisor": 5,
      "word": "Buzz"
    }
  ]
}
```

**Validation Rules**
- `name`: Required, non-empty string
- `author`: Required, non-empty string
- `minNumber`: Must be >= 0
- `maxNumber`: Must be > minNumber
- `rules`: Required, non-empty array
- Game name must be unique

**Response**
- **201 Created**: Game created successfully
- **400 Bad Request**: Validation error
- **409 Conflict**: Game name already exists

#### DELETE /api/game/{id}
Deletes a game and all associated sessions.

**Parameters**
- `id` (int): Game ID

**Response**
- **204 No Content**: Game deleted successfully
- **404 Not Found**: Game not found

### Sessions

#### POST /api/session
Starts a new game session.

**Request Body**
```json
{
  "gameDefinitionId": 1,
  "durationSeconds": 60
}
```

**Validation Rules**
- `gameDefinitionId`: Must reference an existing game
- `durationSeconds`: Must be > 0

**Response**
- **200 OK**: Session started successfully
- **404 Not Found**: Game not found

#### GET /api/session/{id}
Retrieves the current state of a session.

**Parameters**
- `id` (int): Session ID

**Response**
- **200 OK**: Session state
- **404 Not Found**: Session not found

#### POST /api/session/{id}/answer
Submits an answer for the current number in a session.

**Parameters**
- `id` (int): Session ID

**Request Body**
```json
{
  "answer": "Fizz"
}
```

**Validation Rules**
- `answer`: Required, non-empty string

**Response**
- **200 OK**: Updated session state
- **404 Not Found**: Session not found

## Error Responses

### Standard Error Format
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Request successful, no content to return
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate name)
- **500 Internal Server Error**: Server error

## Examples

### Creating a Custom Game
```bash
curl -X POST "http://localhost:5000/api/game" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Even-Odd Game",
    "author": "Math Teacher",
    "minNumber": 1,
    "maxNumber": 50,
    "rules": [
      {"divisor": 2, "word": "Even"},
      {"divisor": 7, "word": "Lucky"}
    ]
  }'
```

### Starting a Game Session
```bash
curl -X POST "http://localhost:5000/api/session" \
  -H "Content-Type: application/json" \
  -d '{
    "gameDefinitionId": 1,
    "durationSeconds": 120
  }'
```

### Submitting an Answer
```bash
curl -X POST "http://localhost:5000/api/session/1/answer" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Fizz"
  }'
```

## Game Logic

### Answer Validation
The API validates answers based on the game rules:

1. For each number, check if it's divisible by any rule divisors
2. If divisible by multiple divisors, concatenate the words
3. If not divisible by any divisor, return the number as a string
4. Compare the expected result with the submitted answer

### Example Calculations
- Number 3 with rule `{divisor: 3, word: "Fizz"}` → "Fizz"
- Number 15 with rules `[{divisor: 3, word: "Fizz"}, {divisor: 5, word: "Buzz"}]` → "FizzBuzz"
- Number 7 with no matching rules → "7"

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

The API is configured to allow cross-origin requests from the frontend application.

## Database

The API uses SQLite with Entity Framework Core for data persistence. The database file is shared among team members for collaborative development.

## Monitoring

### Health Check
- **GET /health**: Basic health check endpoint

### Logging
The API logs important events and errors. Check application logs for debugging information.

## Versioning

The current version is v1.0. Future versions will be available under `/api/v2/` etc.

## Support

For API support and questions:
1. Check the Swagger documentation at `/swagger`
2. Review the error messages for validation issues
3. Check the application logs for server errors

---

**Note**: This API is designed for educational purposes and demonstrates RESTful API design principles with ASP.NET Core. 