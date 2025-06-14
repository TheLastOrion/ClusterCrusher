type GameStatus = 'loading' | 'playing' | 'won' | 'lost';

interface GameState {
  score: number;
  moves: number;
  gameStatus: GameStatus;
  addScore: (amount: number) => void;
  useMove: () => void;
  resetGame: () => void;
}