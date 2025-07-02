"use client";
import { useEffect, useState } from "react";
import { getGames, createGame, deleteGame, GameDefinitionDto, CreateGameDto, GameRuleDto } from "../apis/api";
import { PlayIcon, Trash2Icon, PlusIcon, Loader2Icon } from "lucide-react";

export default function FizzBuzzGameHome() {
  const [games, setGames] = useState<GameDefinitionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateGameDto>({
    name: "",
    author: "",
    minNumber: 1,
    maxNumber: 100,
    rules: [
      { divisor: 3, word: "Fizz" },
      { divisor: 5, word: "Buzz" }
    ],
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGames()
        .then(setGames)
        .catch(() => setError("Could not load games. Please try again later."))
        .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await createGame(form);
      setShowCreate(false);
      setForm({ name: "", author: "", minNumber: 1, maxNumber: 100, rules: [] });
      setGames(await getGames());
    } catch {
      setError("Failed to create game. Please make sure game's name is unique from previous games.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    setError(null);
    try {
      await deleteGame(id);
      setGames(await getGames());
    } catch {
      setError("Failed to delete game. Please try again.");
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">🎮 FizzBuzz Game Center</h1>

          {error && <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded mb-4">{error}</div>}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Available Games</h2>
            <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
                onClick={() => setShowCreate((v) => !v)}
            >
              <PlusIcon className="w-4 h-4" />
              {showCreate ? "Cancel" : "Create Game"}
            </button>
          </div>

          {showCreate && (
              <form className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4 animate-fade-in" onSubmit={handleCreate}>
                <div>
                  <label className="block text-sm font-medium mb-1">Game Name</label>
                  <input
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                      required
                      value={form.author}
                      onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                  />
                </div>

                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Number</label>
                    <input
                        type="number"
                        min={0}
                        className="w-24 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        required
                        value={form.minNumber}
                        onChange={e => setForm(f => ({ ...f, minNumber: +e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Number</label>
                    <input
                        type="number"
                        min={form.minNumber}
                        className="w-24 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        required
                        value={form.maxNumber}
                        onChange={e => setForm(f => ({ ...f, maxNumber: +e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rules</label>
                  <div className="space-y-2">
                    {form.rules.map((r: GameRuleDto, i: number) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                              type="number"
                              min={1}
                              className="w-24 border rounded px-3 py-2"
                              required
                              value={r.divisor}
                              onChange={e => setForm(f => ({
                                ...f,
                                rules: f.rules.map((rr, ii) => ii === i ? { ...rr, divisor: +e.target.value } : rr)
                              }))}
                          />
                          <input
                              className="w-28 border rounded px-3 py-2"
                              required
                              value={r.word}
                              onChange={e => setForm(f => ({
                                ...f,
                                rules: f.rules.map((rr, ii) => ii === i ? { ...rr, word: e.target.value } : rr)
                              }))}
                          />
                          <button
                              type="button"
                              className="text-sm text-red-500 hover:underline"
                              onClick={() => setForm(f => ({ ...f, rules: f.rules.filter((_, ii) => ii !== i) }))}
                          >
                            Remove
                          </button>
                        </div>
                    ))}
                  </div>
                  <button
                      type="button"
                      className="text-sm text-blue-600 hover:underline mt-2"
                      onClick={() => setForm(f => ({ ...f, rules: [...f.rules, { divisor: 1, word: "" }] }))}
                  >
                    + Add Rule
                  </button>
                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow-md flex items-center gap-2"
                >
                  {creating && <Loader2Icon className="w-4 h-4 animate-spin" />}
                  {creating ? "Creating..." : "Create Game"}
                </button>
              </form>
          )}

          {loading ? (
              <div className="text-center text-gray-500">Loading games...</div>
          ) : (
              <ul className="space-y-4">
                {games.map(g => (
                    <li key={g.id} className="bg-white rounded-lg shadow-md p-5">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{g.name}</h3>
                          <p className="text-sm text-gray-500">by {g.author}</p>
                        </div>
                        <div className="flex gap-2">
                          <a
                              href={`/play?gameId=${g.id}`}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow"
                          >
                            <PlayIcon className="w-4 h-4" /> Play
                          </a>
                          <button
                              onClick={() => handleDelete(g.id)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow"
                          >
                            <Trash2Icon className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">Range: {g.minNumber} - {g.maxNumber}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Rules: {(g.rules ?? []).map((r, i) => (
                          <span key={i} className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2">
                      {r.word} (÷{r.divisor})
                    </span>
                      ))}
                      </div>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );
}
