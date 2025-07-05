import { GameRuleDto } from './GameRuleDto';

export type GameDefinitionDto = {
  id: number;
  name: string;
  author: string;
  minNumber: number;
  maxNumber: number;
  rules: GameRuleDto[];
}; 