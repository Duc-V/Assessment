"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getGames, startSession, submitAnswer, SessionStateDto, GameDefinitionDto, } from "../../apis/api";

function PlayGamePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const gameId = Number(params.get("gameId"));
  const [duration, setDuration] = useState(60);
  const [game, setGame] = useState<GameDefinitionDto | null>(null);
  const [session, setSession] = useState<SessionStateDto | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    getGames()
        .then(gs => setGame(gs.find(g => g.id === gameId) ?? null))
        .catch(() => setError("Could not load game. Please try again later."));
  }, [gameId]);

  useEffect(() => {
    if (!session || session.ended) return;
    setTimeLeft(session.timeLeftSeconds);
    const timer = setInterval(() => {
      setTimeLeft(t => (t !== null && t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await startSession({ gameDefinitionId: gameId, durationSeconds: duration });
      setSession(s);
      setStarted(true);
      setTimeLeft(s.timeLeftSeconds);
    } catch {
      setError("Failed to start game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || session.ended) return;
    setLoading(true);
    setError(null);
    try {
      const s = await submitAnswer(session.sessionId, { answer });
      setSession(s);
      setAnswer("");
      setTimeLeft(s.timeLeftSeconds);
    } catch {
      setError("Failed to submit answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return <div className="p-10 text-center text-lg text-gray-600">Loading game...</div>;
  }

  if (!started) {
    return (
        <div className="max-w-xl mx-auto py-12 px-6 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-2">{game.name}</h1>
          <p className="text-gray-500 mb-1">by {game.author}</p>
          <p className="text-sm text-gray-600 mb-1">Range: {game.minNumber} - {game.maxNumber}</p>
          <p className="text-sm text-gray-600 mb-6">Rules: {(game.rules ?? []).map(r => `${r.word} (÷${r.divisor})`).join(", ")}</p>
          <p className="text-xs text-gray-500 mb-6">If the number is not divisible by any of the above, just type the number itself.</p>

          <div className="mb-6">
            <label className="font-medium mr-2">Duration:</label>
            <input
                type="number"
                min={10}
                max={600}
                value={duration}
                onChange={e => setDuration(+e.target.value)}
                className="border px-3 py-2 rounded-md w-24 focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex gap-4">
            <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow transition focus:ring-2 focus:ring-green-400"
                onClick={handleStart}
                disabled={loading}
            >
              {loading ? "Starting..." : "Start Game"}
            </button>
            <button
                className="text-gray-500 underline hover:text-gray-700"
                onClick={() => router.push("/")}
            >
              Back
            </button>
          </div>

          {error && <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded shadow">{error}</div>}
        </div>
    );
  }

  if (!session) {
    return <div className="p-10 text-center text-lg text-gray-600">Loading session...</div>;
  }

  return (
      <div className="max-w-xl mx-auto py-12 px-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
        <p className="text-gray-600 mb-2">by {game.author}</p>
        <div className="text-sm text-gray-600 mb-2">
          Time left: <span className="font-mono">{timeLeft ?? session.timeLeftSeconds}s</span>
        </div>
        <div className="text-sm mb-2">
          Score:
          <span className="ml-2 text-green-700 font-semibold">{session.scoreCorrect} correct</span>,
          <span className="ml-2 text-red-700 font-semibold">{session.scoreIncorrect} incorrect</span>
        </div>
        <div className="text-sm mb-4">
          Rules: {(session.rules ?? []).map(r => `${r.word} (÷${r.divisor})`).join(", ")}
        </div>
        <div className="text-xs text-gray-500 mb-4">If the number is not divisible by any of the above, just type the number itself.</div>

        {session.ended ? (
            <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">🎉 Game Over!</h2>
              <p className="text-lg mb-4">
                Final Score: <span className="text-green-700 font-semibold">{session.scoreCorrect}</span> correct,
                <span className="text-red-700 font-semibold ml-2">{session.scoreIncorrect}</span> incorrect
              </p>
              <button
                  onClick={() => router.push("/")}
                  className="text-gray-600 underline hover:text-gray-800"
              >
                Back to Home
              </button>
            </div>
        ) : (
            <form onSubmit={handleAnswer} className="mt-8 flex flex-col gap-5">
              <div className="text-lg">
                Number: <span className="font-mono text-2xl">{session.nextNumber}</span>
              </div>
              <input
                  className="border rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400 transition"
                  required
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Your answer..."
                  autoFocus
              />
              <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition focus:ring-2 focus:ring-blue-400"
              >
                {loading ? "Checking..." : "Submit Answer"}
              </button>
            </form>
        )}

        {error && <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded shadow">{error}</div>}
      </div>
  );
}

export default function PlayGamePage() {
  return (
      <Suspense fallback={<div className="p-8 text-center text-gray-600">Loading...</div>}>
        <PlayGamePageInner />
      </Suspense>
  );
}
