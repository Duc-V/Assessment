import { Loader2Icon } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingScreen({ message = "Loading...", size = "md" }: LoadingScreenProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-600">
      <Loader2Icon data-testid="loader" className={`${sizeClasses[size]} animate-spin mb-2`} />
      <p className="text-sm">{message}</p>
    </div>
  );
} 