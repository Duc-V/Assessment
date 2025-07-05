import { GameRuleDto } from './GameRuleDto';

export type SessionStateDto = {
  sessionId: number;
  gameDefinitionId: number;
  scoreCorrect: number;
  scoreIncorrect: number;
  nextNumber: number | null;
  timeLeftSeconds: number;
  ended: boolean;
  rules: GameRuleDto[];
}; 