export enum GameState {
  Idle = 'IDLE',
  Swinging = 'SWINGING',
  Dropping = 'DROPPING',
  Resolving = 'RESOLVING',
  Lost = 'LOST'
}

export interface DifficultyProfile {
  id: string;
  label: string;
  swingSpeed: number;
  swingRange: number;
  horizontalAssist: number;
  dropSpeed: number;
}

export interface RoundConfig {
  targetX: number;
  difficulty: DifficultyProfile;
  multipliers: number[];
}

export interface PlayerProgress {
  balance: number;
  bestScore: number;
}

export interface LandingResult {
  success: boolean;
  overlapRatio: number;
}
