import { SubmitAnswerDto } from '../../types/SubmitAnswerDto';
import { SessionStateDto } from '../../types/SessionStateDto';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function submitAnswer(sessionId: number, dto: SubmitAnswerDto): Promise<SessionStateDto> {
  const res = await fetch(`${API_BASE}/session/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to submit answer');
  return res.json();
} 