"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, PlusIcon, Loader2Icon } from "lucide-react";
import { CreateGameDto } from "../../types/CreateGameDto";
import { GameRuleDto } from "../../types/GameRuleDto";
import { createGame } from "../../apis/game/create-game.api";
import ErrorDisplay from "../../components/ErrorDisplay";

export default function CreateGamePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Game name is required";
    } else if (form.name.trim().length < 3) {
      errors.name = "Game name must be at least 3 characters";
    }

    if (!form.author.trim()) {
      errors.author = "Author name is required";
    }

    if (form.minNumber < 1) {
      errors.minNumber = "Minimum number must be at least 1";
    }

    if (form.maxNumber <= form.minNumber) {
      errors.maxNumber = "Maximum number must be greater than minimum number";
    }

    if (form.rules.length === 0) {
      errors.rules = "At least one rule is required";
    } else {
      form.rules.forEach((rule, index) => {
        if (rule.divisor < 1) {
          errors[`rule${index}Divisor`] = "Divisor must be at least 1";
        }
        if (!rule.word.trim()) {
          errors[`rule${index}Word`] = "Word is required";
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setCreating(true);
    try {
      await createGame(form);
      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      if (errorMessage.includes("unique")) {
        setError("Game name must be unique. Please choose a different name.");
      } else {
        setError("Failed to create game. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const addRule = () => {
    setForm(f => ({ 
      ...f, 
      rules: [...f.rules, { divisor: 1, word: "" }] 
    }));
  };

  const removeRule = (index: number) => {
    setForm(f => ({ 
      ...f, 
      rules: f.rules.filter((_, i) => i !== index) 
    }));
  };

  const updateRule = (index: number, field: keyof GameRuleDto, value: string | number) => {
    setForm(f => ({
      ...f,
      rules: f.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  };

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Game</h1>
          <p className="text-gray-600 mb-8">Design your own FizzBuzz game with custom rules</p>

          <ErrorDisplay error={error} onDismiss={() => setError(null)} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Name *
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
                  formErrors.name ? "border-red-300" : "border-gray-300"
                }`}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Enter game name..."
              />
              {formErrors.name && (
                <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
                  formErrors.author ? "border-red-300" : "border-gray-300"
                }`}
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                placeholder="Enter author name..."
              />
              {formErrors.author && (
                <p className="text-red-600 text-sm mt-1">{formErrors.author}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Number *
                </label>
                <input
                  type="number"
                  min={1}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
                    formErrors.minNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  value={form.minNumber}
                  onChange={e => setForm(f => ({ ...f, minNumber: +e.target.value }))}
                />
                {formErrors.minNumber && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.minNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Number *
                </label>
                <input
                  type="number"
                  min={form.minNumber + 1}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
                    formErrors.maxNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  value={form.maxNumber}
                  onChange={e => setForm(f => ({ ...f, maxNumber: +e.target.value }))}
                />
                {formErrors.maxNumber && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.maxNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rules *
              </label>
              {formErrors.rules && (
                <p className="text-red-600 text-sm mb-2">{formErrors.rules}</p>
              )}
              <div className="space-y-3">
                {form.rules.map((rule, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={1}
                        className={`w-24 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
                          formErrors[`rule${index}Divisor`] ? "border-red-300" : "border-gray-300"
                        }`}
                        value={rule.divisor}
                        onChange={e => updateRule(index, "divisor", +e.target.value)}
                        placeholder="Divisor"
                      />
                      {formErrors[`rule${index}Divisor`] && (
                        <p className="text-red-600 text-xs mt-1">{formErrors[`rule${index}Divisor`]}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
                          formErrors[`rule${index}Word`] ? "border-red-300" : "border-gray-300"
                        }`}
                        value={rule.word}
                        onChange={e => updateRule(index, "word", e.target.value)}
                        placeholder="Word to display"
                      />
                      {formErrors[`rule${index}Word`] && (
                        <p className="text-red-600 text-xs mt-1">{formErrors[`rule${index}Word`]}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-3 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Rule
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                {creating && <Loader2Icon className="w-5 h-5 animate-spin" />}
                {creating ? "Creating Game..." : "Create Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 