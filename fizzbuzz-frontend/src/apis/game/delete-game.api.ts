const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function deleteGame(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/game/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete game');
} 