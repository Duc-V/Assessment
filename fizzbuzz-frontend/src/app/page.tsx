"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { GameDefinitionDto } from "../types/GameDefinitionDto";
import { getGames } from "../apis/game/get-games.api";
import { deleteGame } from "../apis/game/delete-game.api";
import LoadingScreen from "../components/LoadingScreen";
import ErrorDisplay from "../components/ErrorDisplay";
import GameCard from "../components/GameCard";
import ConfirmModal from "../components/ConfirmModal";

export default function FizzBuzzGameHome() {
  const router = useRouter();
  const [games, setGames] = useState<GameDefinitionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; gameId: number | null; gameName: string }>({
    isOpen: false,
    gameId: null,
    gameName: ""
  });

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesData = await getGames();
      setGames(gamesData);
    } catch {
      setError("Could not load games. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (gameId: number, gameName: string) => {
    setDeleteModal({
      isOpen: true,
      gameId,
      gameName
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.gameId) return;
    
    setError(null);
    try {
      await deleteGame(deleteModal.gameId);
      await loadGames(); // Reload the games list
      setDeleteModal({ isOpen: false, gameId: null, gameName: "" });
    } catch {
      setError("Failed to delete game. Please try again.");
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, gameId: null, gameName: "" });
  };

  if (loading) {
    return <LoadingScreen message="Loading games..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">🎮 FizzBuzz Game Center</h1>
          <p className="text-lg text-gray-600">Create, play, and master custom FizzBuzz games</p>
        </div>

        <ErrorDisplay error={error} onDismiss={() => setError(null)} />

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Available Games</h2>
            <p className="text-gray-600 mt-1">
              {games.length} game{games.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Game
          </button>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No games yet</h3>
              <p className="text-gray-500 mb-6">Create your first FizzBuzz game to get started!</p>
              <button
                onClick={() => router.push("/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Create Your First Game
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={() => handleDelete(game.id, game.name)}
              />
            ))}
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title="Delete Game"
          message={`Are you sure you want to delete "${deleteModal.gameName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
}
