import { create } from 'zustand';

type GameStatus = 'loading' | 'playing' | 'won' | 'lost';

interface GameState {
  score: number;
  moves: number;
  gameStatus: GameStatus;
  addScore: (amount: number) => void;
  useMove: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  moves: 25,
  gameStatus: 'loading',

  addScore: (amount) => set((state) => ({ score: state.score + amount })),
  useMove: () => set((state) => ({ moves: state.moves - 1 })),
  resetGame: () =>
    set(() => ({
      score: 0,
      moves: 25,
      gameStatus: 'playing',
    })),
}));