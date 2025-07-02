# FizzBuzz Game Frontend

This is a Next.js 14 + TypeScript + Tailwind CSS frontend for the FizzBuzz Game platform.

## Features
- Create and list custom FizzBuzz-like games
- Play games with real-time scoring and timer
- Connects to a .NET 8 backend (see backend/README)

## Running Locally

1. Make sure the backend API is running at http://localhost:5000
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Usage

To run the full stack with Docker Compose:

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

To stop and remove containers:

```bash
docker-compose down
```

## API
- The frontend expects the backend API at `http://localhost:5000/api` (see `src/app/api.ts`)

## Testing
- Add tests in `src/` using your preferred React testing library (e.g., Jest, Testing Library)
