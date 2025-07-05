import { GameRuleDto } from './GameRuleDto';

export type CreateGameDto = {
  name: string;
  author: string;
  minNumber: number;
  maxNumber: number;
  rules: GameRuleDto[];
}; 