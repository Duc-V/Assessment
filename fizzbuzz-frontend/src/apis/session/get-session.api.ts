import { SessionStateDto } from '../../types/SessionStateDto';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function getSession(sessionId: number): Promise<SessionStateDto> {
  const res = await fetch(`${API_BASE}/session/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
} 