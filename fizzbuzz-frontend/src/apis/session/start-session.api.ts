import { StartSessionDto } from '../../types/StartSessionDto';
import { SessionStateDto } from '../../types/SessionStateDto';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function startSession(dto: StartSessionDto): Promise<SessionStateDto> {
  const res = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to start session');
  return res.json();
} 