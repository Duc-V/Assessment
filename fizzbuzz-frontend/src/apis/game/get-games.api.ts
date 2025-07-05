import { GameDefinitionDto } from '../../types/GameDefinitionDto';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function getGames(): Promise<GameDefinitionDto[]> {
  const res = await fetch(`${API_BASE}/game`);
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
} 