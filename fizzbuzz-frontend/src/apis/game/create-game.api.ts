import { CreateGameDto } from '../../types/CreateGameDto';
import { GameDefinitionDto } from '../../types/GameDefinitionDto';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function createGame(dto: CreateGameDto): Promise<GameDefinitionDto> {
  const res = await fetch(`${API_BASE}/game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create game');
  return res.json();
} 