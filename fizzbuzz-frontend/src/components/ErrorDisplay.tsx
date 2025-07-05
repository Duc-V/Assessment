import { AlertCircleIcon, XIcon } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  variant?: "error" | "warning" | "info";
}

export default function ErrorDisplay({ error, onDismiss, variant = "error" }: ErrorDisplayProps) {
  if (!error) return null;

  const variantClasses = {
    error: "bg-red-100 text-red-700 border-red-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300", 
    info: "bg-blue-100 text-blue-700 border-blue-300"
  };

  return (
    <div className={`${variantClasses[variant]} border px-4 py-3 rounded-md mb-4 flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <AlertCircleIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{error}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
} 