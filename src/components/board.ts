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
        // Create a container for this cell
        const cellContainer = new Container();
        cellContainer.x = col * this.cellSize;
        cellContainer.y = row * this.cellSize;

        // Background sprite
        const cellSprite = Sprite.from('/assets/cell.png');
        const cellScale = this.cellSize / cellSprite.texture.width;
        cellSprite.scale.set(cellScale);
        cellContainer.addChild(cellSprite);

        // Random gem
        const randomColor = this.getRandomGemColor();
        const gemSprite = Sprite.from(`/assets/gem_${randomColor}.png`);
        gemSprite.anchor.set(0.5);
        gemSprite.x = this.cellSize / 2;
        gemSprite.y = this.cellSize / 2;

        const gemTargetSize = this.cellSize * 0.8;
        const gemScale = gemTargetSize / gemSprite.texture.width;
        gemSprite.scale.set(gemScale);

        cellContainer.addChild(gemSprite);

        // Add the cell container to board
        this.addChild(cellContainer);

        rowCells.push({
          sprite: gemSprite,
          color: randomColor,
        });
      }

      this.cells.push(rowCells);
    }

    // Center the entire board
    this.x = (window.innerWidth - this.gridSize * this.cellSize) / 2;
    this.y = (window.innerHeight - this.gridSize * this.cellSize) / 2;
  }
  private getRandomGemColor(): GemColor {
    const randomIndex = Math.floor(Math.random() * GEM_COLORS.length);
    return GEM_COLORS[randomIndex];
  }
}