import { Container, Sprite } from 'pixi.js';
import { Cell } from '../interfaces/cell';

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
    for (let row = 0; row < this.gridSize; row++) {
      const rowCells: Cell[] = [];

      for (let col = 0; col < this.gridSize; col++) {
        const cellSprite = Sprite.from('/assets/cell.png');
        cellSprite.x = col * this.cellSize;
        cellSprite.y = row * this.cellSize;

        const cellScale = this.cellSize / cellSprite.texture.width;
        cellSprite.scale.set(cellScale);
        this.addChild(cellSprite);

        const randomColor = this.getRandomGemColor();
        const gemSprite = Sprite.from(`/assets/gem_${randomColor}.png`);
        gemSprite.x = col * this.cellSize + this.cellSize / 2;
        gemSprite.y = row * this.cellSize + this.cellSize / 2;
        gemSprite.width = this.cellSize * 0.8;
        const scale = (this.cellSize * 0.8) / gemSprite.texture.width;
        gemSprite.scale.set(scale);
        gemSprite.anchor.set(0.5);

        this.addChild(gemSprite);

        rowCells.push({
          sprite: gemSprite,
          color: randomColor,
        });
      }

      this.cells.push(rowCells);
    }

    this.x = (window.innerWidth - this.gridSize * this.cellSize) / 2;
    this.y = (window.innerHeight - this.gridSize * this.cellSize) / 2;
  }

  private getRandomGemColor(): GemColor {
    const randomIndex = Math.floor(Math.random() * GEM_COLORS.length);
    return GEM_COLORS[randomIndex];
  }
}