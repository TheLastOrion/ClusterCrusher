import { Container, Sprite } from 'pixi.js';
import { Cell } from '../interfaces/cell';

const GEM_COLORS = ['blue', 'green', 'pink'] as const;
type GemColor = typeof GEM_COLORS[number];

export class Board extends Container {
  private readonly _gridSize = 5;
  private readonly _cellsize = 80;
  private _cells: Cell[][] = [];

  constructor() {
    super();
    this.buildBoard();
  }

  public getCell(row: number, col: number) {
    return this._cells[row][col];
}

  public get gridSize() {
  return this._gridSize;
}

  private buildBoard() {
    for (let row = 0; row < this._gridSize; row++) {
      const rowCells: Cell[] = [];

      for (let col = 0; col < this._gridSize; col++) {

        const cellContainer = new Container();
        cellContainer.x = col * this._cellsize;
        cellContainer.y = row * this._cellsize;

        // Background sprite
        const cellSprite = Sprite.from('/assets/cell.png');
        const cellScale = this._cellsize / cellSprite.texture.width;
        cellSprite.scale.set(cellScale);
        cellContainer.addChild(cellSprite);

        // Random gem
        const randomColor = this.getRandomGemColor();
        const gemSprite = Sprite.from(`/assets/gem_${randomColor}.png`);
        gemSprite.anchor.set(0.5);
        gemSprite.x = this._cellsize / 2;
        gemSprite.y = this._cellsize / 2;

        const gemTargetSize = this._cellsize * 0.8;
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

      this._cells.push(rowCells);
    }

    // Center the entire board
    this.x = (window.innerWidth - this._gridSize * this._cellsize) / 2;
    this.y = (window.innerHeight - this._gridSize * this._cellsize) / 2;
  }
  private getRandomGemColor(): GemColor {
    const randomIndex = Math.floor(Math.random() * GEM_COLORS.length);
    return GEM_COLORS[randomIndex];
  }

  
}