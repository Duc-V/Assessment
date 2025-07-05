import { PlayIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { GameDefinitionDto } from "../types/GameDefinitionDto";

interface GameCardProps {
  game: GameDefinitionDto;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function GameCard({ game, onDelete, showActions = true }: GameCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{game.name}</h3>
          <p className="text-sm text-gray-500 mb-2">by {game.author}</p>
          <div className="text-sm text-gray-700 mb-2">
            Range: {game.minNumber} - {game.maxNumber}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2 ml-4">
            <a
              href={`/game/${game.id}`}
              className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm shadow transition-colors"
            >
              <EyeIcon className="w-4 h-4" /> Details
            </a>
            <a
              href={`/play?gameId=${game.id}`}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow transition-colors"
            >
              <PlayIcon className="w-4 h-4" /> Play
            </a>
            {onDelete && (
              <button
                onClick={() => onDelete(game.id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow transition-colors"
              >
                <Trash2Icon className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        <span className="font-medium">Rules: </span>
        {(game.rules ?? []).map((rule, _i) => (
          <span key={_i} className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-1">
            {rule.word} (÷{rule.divisor})
          </span>
        ))}
      </div>
    </div>
  );
} 