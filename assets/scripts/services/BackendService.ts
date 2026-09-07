import { DifficultyLevels } from '../config/DifficultyConfig';
import { RoundConfig } from '../types/Types';

export class BackendService {
  async generateRound(difficultyId: string): Promise<RoundConfig> {
    const difficulty = DifficultyLevels.find((d) => d.id === difficultyId) ?? DifficultyLevels[1];
    const targetX = (Math.random() * 2 - 1) * difficulty.swingRange * 0.45;
    const multipliers = [1.1, 1.2, 1.35, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 5, 6];
    return { difficulty, targetX, multipliers };
  }
}
