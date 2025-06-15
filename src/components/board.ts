import { Container, Sprite } from 'pixi.js';
import { Cell, GemColor } from '../interfaces/cell';
import { Cluster } from '../interfaces/cluster';
import { GEM_COLORS } from '../constants';


export class Board extends Container {
  private readonly _gridSize = 5;
  private readonly _cellSize = 80;
  private _cells: Cell[][] = [];

  constructor() {
    super();
    this.buildBoard();
  }

  public getCell(row: number, col: number) {
    return this._cells[row][col];
}

public get cells(): Cell[][] {
  return this._cells;
}
public get cellSize() { return this._cellSize; }

public getCellContainer(row: number, col: number): Container {
  return this.children[row * this._gridSize + col] as Container;
}

  public get gridSize() {
  return this._gridSize;
}

public setCell(row: number, col: number, color: GemColor, sprite: Sprite): void {
  const cell = this._cells[row][col];
  cell.color = color;
  cell.sprite = sprite;
}

public placeGem(row: number, col: number, color: GemColor) {
  const cell = this._cells[row][col];
  cell.color = color;
  cell.sprite.texture = Sprite.from(`/assets/gem_${color}.png`).texture;
}


public crushClusters(clusters: Cluster[]): void {
  for (const cluster of clusters) {
    for (const pos of cluster.positions) {
      const container = this.getCellContainer(pos.row, pos.col);

      // Always preserve cell background, so remove only gem sprite
      if (container.children.length > 1) {
        const gemSprite = container.getChildAt(1) as Sprite;
        container.removeChild(gemSprite);
        gemSprite.destroy();
      }
    }
  }
}

private calculateGemScale(): number {
  const gemTargetSize = this._cellSize * 0.8;
  const dummyTexture = Sprite.from(`/assets/gem_blue.png`).texture;
  return gemTargetSize / dummyTexture.width;
}

public refillBoard(): void {
  const gemScale = this.calculateGemScale();

  for (let row = 0; row < this.gridSize; row++) {
    for (let col = 0; col < this.gridSize; col++) {
      const container = this.getCellContainer(row, col);

      if (container.children.length === 1) {
        const color = this.generateRandomGem();
        const gemSprite = Sprite.from(`/assets/gem_${color}.png`);

        gemSprite.anchor.set(0.5);
        gemSprite.x = this.cellSize / 2;
        gemSprite.y = this.cellSize / 2;

        // ✅ Start with scale 0 but target the gemScale
        gemSprite.scale.set(0); 

        
        container.addChild(gemSprite);

        this.animatePop(gemSprite, gemScale);

        this._cells[row][col].color = color;
        this._cells[row][col].sprite = gemSprite;
      }
    }
  }
}


private generateRandomGem(): GemColor {
  const colors: GemColor[] = Array.from(GEM_COLORS);
  return colors[Math.floor(Math.random() * colors.length)];
}

private animatePop(sprite: Sprite, targetScale: number): void {
  const duration = 300;
  const start = performance.now();

  const animate = (time: number) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const scale = targetScale * progress;

    sprite.scale.set(scale, scale);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}

  private buildBoard() {
    for (let row = 0; row < this._gridSize; row++) {
      const rowCells: Cell[] = [];

      for (let col = 0; col < this._gridSize; col++) {

        const cellContainer = new Container();
        cellContainer.x = col * this._cellSize;
        cellContainer.y = row * this._cellSize;

        // Background sprite
        const cellSprite = Sprite.from('/assets/cell.png');
        const cellScale = this._cellSize / cellSprite.texture.width;
        cellSprite.scale.set(cellScale);
        cellContainer.addChild(cellSprite);

        // Random gem
        const randomColor = this.getRandomGemColor();
        const gemSprite = Sprite.from(`/assets/gem_${randomColor}.png`);
        gemSprite.anchor.set(0.5);
        gemSprite.x = this._cellSize / 2;
        gemSprite.y = this._cellSize / 2;

        const gemTargetSize = this._cellSize * 0.8;
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
    this.x = (window.innerWidth - this._gridSize * this._cellSize) / 2;
    this.y = (window.innerHeight - this._gridSize * this._cellSize) / 2;
  }
  private getRandomGemColor(): GemColor {
    const randomIndex = Math.floor(Math.random() * GEM_COLORS.length);
    return GEM_COLORS[randomIndex];
  }

  
}