import { Suspense } from "react";
import ScoreAnalysisPage from "./ScoreAnalysisPage";

export default function ScorePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScoreAnalysisPage />
    </Suspense>
  );
} 