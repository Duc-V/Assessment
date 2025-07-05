"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, PlayIcon, EditIcon } from "lucide-react";
import { GameDefinitionDto } from "../../../types/GameDefinitionDto";
import { getGames } from "../../../apis/game/get-games.api";
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorDisplay from "../../../components/ErrorDisplay";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.id);
  
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
    return <LoadingScreen message="Loading game details..." />;
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">{game.name}</h1>
            <p className="text-xl opacity-90">by {game.author}</p>
          </div>

          {/* Game Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Game Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Number Range</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {game.minNumber} - {game.maxNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Total Numbers</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {game.maxNumber - game.minNumber + 1} numbers
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Rules Count</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {game.rules.length} rule{game.rules.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Game Rules</h2>
                <div className="space-y-3">
                  {game.rules.map((rule, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-800">{rule.word}</span>
                          <span className="text-gray-600 ml-2">(divisible by {rule.divisor})</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Rule #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 italic">
                  If a number is not divisible by any rule, display the number itself.
                </p>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Examples</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[game.minNumber, game.minNumber + 1, Math.floor((game.minNumber + game.maxNumber) / 2), game.maxNumber].map((num) => {
                  const applicableRules = game.rules.filter(rule => num % rule.divisor === 0);
                  const result = applicableRules.length > 0 
                    ? applicableRules.map(rule => rule.word).join('')
                    : num.toString();
                  
                  return (
                    <div key={num} className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600">Number</div>
                      <div className="text-2xl font-bold text-blue-600">{num}</div>
                      <div className="text-sm text-gray-600 mt-1">Result</div>
                      <div className="text-lg font-semibold text-gray-800">{result}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex gap-4">
                <button
                  onClick={() => router.push(`/play?gameId=${game.id}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                  Play Game
                </button>
                <button
                  onClick={() => router.push(`/score?gameId=${game.id}`)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                  <EditIcon className="w-5 h-5" />
                  View Scores
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 