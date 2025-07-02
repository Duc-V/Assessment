export type GameRuleDto = { divisor: number; word: string };
export type GameDefinitionDto = {
  id: number;
  name: string;
  author: string;
  minNumber: number;
  maxNumber: number;
  rules: GameRuleDto[];
};
export type CreateGameDto = {
  name: string;
  author: string;
  minNumber: number;
  maxNumber: number;
  rules: GameRuleDto[];
};
export type StartSessionDto = { gameDefinitionId: number; durationSeconds: number };
export type SubmitAnswerDto = { answer: string };
export type SessionStateDto = {
  sessionId: number;
  gameDefinitionId: number;
  scoreCorrect: number;
  scoreIncorrect: number;
  nextNumber: number | null;
  timeLeftSeconds: number;
  ended: boolean;
  rules: GameRuleDto[];
};

// TODO: Use environment variables for API base URL in production
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'; // Docker default

export async function getGames(): Promise<GameDefinitionDto[]> {
  const res = await fetch(`${API_BASE}/game`);
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}

export async function createGame(dto: CreateGameDto): Promise<GameDefinitionDto> {
  const res = await fetch(`${API_BASE}/game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create game');
  return res.json();
}

export async function startSession(dto: StartSessionDto): Promise<SessionStateDto> {
  const res = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to start session');
  return res.json();
}

export async function submitAnswer(sessionId: number, dto: SubmitAnswerDto): Promise<SessionStateDto> {
  const res = await fetch(`${API_BASE}/session/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to submit answer');
  return res.json();
}

export async function getSession(sessionId: number): Promise<SessionStateDto> {
  const res = await fetch(`${API_BASE}/session/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function deleteGame(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/game/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete game');
} 