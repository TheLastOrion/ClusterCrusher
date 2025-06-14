import { Container, Sprite } from 'pixi.js';
import { Cell } from '../src/interfaces/cell';

const GEM_COLORS = ['blue', 'green', 'pink'] as const;
type GemColor = typeof GEM_COLORS[number];

export class Board extends Container {
  private readonly gridSize = 5;
  private readonly cellSize = 80;
  private cells: Cell[][] = [];

  constructor() {
    super();
    this.buildBoard();
  }

  private buildBoard() {
    
  }

}