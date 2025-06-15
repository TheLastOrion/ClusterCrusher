import create from 'zustand';
import { GameState, GameStatus } from './interfaces/game-state';

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  moves: 0,
  gameStatus: 'playing',

  addScore: (amount: number) => {
    set((state) => {
      const newScore = state.score + amount;
      let newStatus = state.gameStatus;

      if (newScore >= 500) {
        newStatus = 'won';
      } else if (state.moves >= 25) {
        newStatus = 'lost';
      }

      return { score: newScore, gameStatus: newStatus };
    });
  },

  useMove: () => {
    set((state) => {
      const newMoves = state.moves + 1;
      let newStatus = state.gameStatus;

      if (newMoves >= 25 && state.score < 500) {
        newStatus = 'lost';
      } else if (state.score >= 500) {
        newStatus = 'won';
      }

      return { moves: newMoves, gameStatus: newStatus };
    });
  },

  resetGame: () => set({ score: 0, moves: 0, gameStatus: 'playing' }),
}));