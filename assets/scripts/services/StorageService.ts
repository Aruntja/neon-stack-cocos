import { INITIAL_BALANCE } from '../config/Constants';
import { PlayerProgress } from '../types/Types';

const KEY = 'neon-stack-progress-v1';

export class StorageService {
  read(): PlayerProgress {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { balance: INITIAL_BALANCE, bestScore: 0 };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        balance: Number.isFinite(parsed.balance) ? parsed.balance : INITIAL_BALANCE,
        bestScore: Number.isFinite(parsed.bestScore) ? parsed.bestScore : 0
      };
    } catch {
      return { balance: INITIAL_BALANCE, bestScore: 0 };
    }
  }

  write(progress: PlayerProgress): void {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }
}
