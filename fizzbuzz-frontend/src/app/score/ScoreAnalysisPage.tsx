"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, BarChart3Icon, TrophyIcon, ClockIcon } from "lucide-react";
import { GameDefinitionDto } from "../../types/GameDefinitionDto";
import { getGames } from "../../apis/game/get-games.api";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorDisplay from "../../components/ErrorDisplay";

export default function ScoreAnalysisPage() {
  const params = useSearchParams();
  const router = useRouter();
  const gameId = Number(params.get("gameId"));
  
  const [game, setGame] = useState<GameDefinitionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const games = await getGames();
        const foundGame = games.find(g => g.id === gameId);
        if (!foundGame) {
          setError("Game not found");
          return;
        }
        setGame(foundGame);
      } catch {
        setError("Failed to load game details");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  if (loading) {
    return <LoadingScreen message="Loading score analysis..." />;
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorDisplay error={error} />
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  // // Mock data for demonstration - in a real app, this would come from the backend
  // const mockStats = {
  //   totalSessions: 15,
  //   averageScore: 78.5,
  //   bestScore: 95,
  //   averageTime: 45.2,
  //   totalPlayers: 8,
  //   recentSessions: [
  //     { score: 85, time: 42, date: "2024-01-15" },
  //     { score: 92, time: 38, date: "2024-01-14" },
  //     { score: 76, time: 51, date: "2024-01-13" },
  //     { score: 88, time: 44, date: "2024-01-12" },
  //     { score: 95, time: 35, date: "2024-01-11" },
  //   ]
  // };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Games
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3Icon className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Score Analysis</h1>
            </div>
            <p className="text-xl opacity-90">{game.name} by {game.author}</p>
          </div>

          {/* Stats Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{mockStats.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{mockStats.averageScore}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{mockStats.bestScore}%</div>
                <div className="text-sm text-gray-600">Best Score</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{mockStats.averageTime}s</div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Performance</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  {mockStats.recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">#{mockStats.totalSessions - index}</div>
                        <div>
                          <div className="font-semibold text-gray-800">{session.score}%</div>
                          <div className="text-sm text-gray-600">{session.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm">{session.time}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Rules Performance */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rule Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {game.rules.map((rule, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{rule.word}</h3>
                      <span className="text-sm text-gray-500">÷{rule.divisor}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-semibold text-green-600">87%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Common Mistakes:</span>
                        <span className="font-semibold text-red-600">13%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/play?gameId=${game.id}`)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                <TrophyIcon className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={() => router.push(`/game/${game.id}`)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Game Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 