import { DifficultyProfile } from '../types/Types';

export const DifficultyLevels: DifficultyProfile[] = [
  { id: 'easy', label: 'Easy', swingSpeed: 0.9, swingRange: 180, horizontalAssist: 0.8, dropSpeed: 900 },
  { id: 'normal', label: 'Normal', swingSpeed: 1.15, swingRange: 230, horizontalAssist: 0.55, dropSpeed: 1050 },
  { id: 'hard', label: 'Hard', swingSpeed: 1.45, swingRange: 280, horizontalAssist: 0.35, dropSpeed: 1200 }
];
