"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { GameDefinitionDto } from "../../types/GameDefinitionDto";
import { SessionStateDto } from "../../types/SessionStateDto";
import { getGames } from "../../apis/game/get-games.api";
import { startSession } from "../../apis/session/start-session.api";
import { submitAnswer } from "../../apis/session/submit-answer.api";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorDisplay from "../../components/ErrorDisplay";

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
  const [answerError, setAnswerError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const games = await getGames();
        const foundGame = games.find(g => g.id === gameId);
        if (!foundGame) {
          setError("Game not found. Please select a valid game.");
          return;
        }
        setGame(foundGame);
      } catch {
        setError("Could not load game. Please try again later.");
      }
    };

    loadGame();
  }, [gameId]);

  useEffect(() => {
    if (!session || session.ended) return;
    
    setTimeLeft(session.timeLeftSeconds);
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t !== null && t > 0) {
          return t - 1;
        }
        return 0;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [session]);

  const validateAnswer = (): boolean => {
    if (!answer.trim()) {
      setAnswerError("Please enter an answer");
      return false;
    }
    setAnswerError(null);
    return true;
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await startSession({ 
        gameDefinitionId: gameId, 
        durationSeconds: duration 
      });
      setSession(newSession);
      setStarted(true);
      setTimeLeft(newSession.timeLeftSeconds);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      if (errorMessage.includes("not found")) {
        setError("Game not found. Please try again.");
      } else {
        setError("Failed to start game. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || session.ended) return;
    
    if (!validateAnswer()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedSession = await submitAnswer(session.sessionId, { answer: answer.trim() });
      setSession(updatedSession);
      setAnswer("");
      setTimeLeft(updatedSession.timeLeftSeconds);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      if (errorMessage.includes("not found")) {
        setError("Session not found. Please start a new game.");
      } else {
        setError("Failed to submit answer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return <LoadingScreen message="Loading game..." />;
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Games
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">{game.name}</h1>
            <p className="text-gray-500 mb-1">by {game.author}</p>
            <p className="text-sm text-gray-600 mb-1">Range: {game.minNumber} - {game.maxNumber}</p>
            <p className="text-sm text-gray-600 mb-6">
              Rules: {(game.rules ?? []).map((r) => `${r.word} (÷${r.divisor})`).join(", ")}
            </p>
            <p className="text-xs text-gray-500 mb-6">
              If the number is not divisible by any of the above, just type the number itself.
            </p>

            <div className="mb-6">
              <label className="font-medium text-gray-700 mr-2">Duration (seconds):</label>
              <input
                type="number"
                min={10}
                max={600}
                value={duration}
                onChange={e => setDuration(+e.target.value)}
                className="border px-3 py-2 rounded-md w-24 focus:ring-2 focus:ring-blue-400 transition-colors"
              />
            </div>

            <ErrorDisplay error={error} onDismiss={() => setError(null)} />

            <div className="flex gap-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition-colors focus:ring-2 focus:ring-green-400 disabled:bg-green-400"
                onClick={handleStart}
                disabled={loading}
              >
                {loading && <Loader2Icon className="w-4 h-4 animate-spin mr-2" />}
                {loading ? "Starting..." : "Start Game"}
              </button>
              <button
                className="text-gray-500 underline hover:text-gray-700 transition-colors"
                onClick={() => router.push("/")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoadingScreen message="Loading session..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{game.name}</h1>
          <p className="text-gray-600 mb-2">by {game.author}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">Time Left</div>
              <div className="text-2xl font-bold text-blue-600">
                {timeLeft ?? session.timeLeftSeconds}s
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-green-600">
                {session.scoreCorrect} / {session.scoreCorrect + session.scoreIncorrect}
              </div>
            </div>
          </div>

          <div className="text-sm mb-4">
            <span className="text-green-700 font-semibold">{session.scoreCorrect} correct</span>,
            <span className="text-red-700 font-semibold ml-2">{session.scoreIncorrect} incorrect</span>
          </div>
          
          <div className="text-sm mb-4">
            Rules: {(session.rules ?? []).map((r) => `${r.word} (÷${r.divisor})`).join(", ")}
          </div>
          
          <div className="text-xs text-gray-500 mb-6">
            If the number is not divisible by any of the above, just type the number itself.
          </div>

          {session.ended ? (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">🎉 Game Over!</h2>
              <p className="text-lg mb-4">
                Final Score: <span className="text-green-700 font-semibold">{session.scoreCorrect}</span> correct,
                <span className="text-red-700 font-semibold ml-2">{session.scoreIncorrect}</span> incorrect
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-gray-600 underline hover:text-gray-800 transition-colors"
                >
                  Back to Games
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAnswer} className="mt-8 space-y-4">
              <div className="text-center">
                <div className="text-lg text-gray-600 mb-2">Number:</div>
                <div className="text-4xl font-bold text-blue-600 font-mono">
                  {session.nextNumber}
                </div>
              </div>
              
              <div>
                <input
                  className={`w-full border rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-blue-400 transition-colors ${
                    answerError ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                  value={answer}
                  onChange={e => {
                    setAnswer(e.target.value);
                    if (answerError) setAnswerError(null);
                  }}
                  placeholder="Your answer..."
                  autoFocus
                  disabled={loading}
                />
                {answerError && (
                  <p className="text-red-600 text-sm mt-1">{answerError}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md shadow-md transition-colors focus:ring-2 focus:ring-blue-400"
              >
                {loading && <Loader2Icon className="w-4 h-4 animate-spin mr-2" />}
                {loading ? "Checking..." : "Submit Answer"}
              </button>
            </form>
          )}

          <ErrorDisplay error={error} onDismiss={() => setError(null)} />
        </div>
      </div>
    </div>
  );
}

export default function PlayGamePage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <PlayGamePageInner />
    </Suspense>
  );
}
