import create from 'zustand';
import { GameState, GameStatus } from './interfaces/game-state';

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  moves: 0,
  gameStatus: 'playing',

  addScore: (amount: number) => {
    set((state) => {
      const newScore = state.score + amount;
      return { score: newScore };
    });
  },

  useMove: () => {
    set((state) => {
      const newMoves = state.moves + 1;
      let newStatus = state.gameStatus;

      // After 25 moves, check win/lose condition
      if (newMoves >= 25) {
        if (state.score >= 500) {
          newStatus = 'won'; // Win after 25 moves if score >= 500
        } else {
          newStatus = 'lost'; // Lose after 25 moves if score < 500
        }
      }

      return { moves: newMoves, gameStatus: newStatus };
    });
  },

  resetGame: () => set({ score: 0, moves: 0, gameStatus: 'playing' }),
}));