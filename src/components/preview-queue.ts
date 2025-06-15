import { Container, Sprite } from 'pixi.js';
import { GEM_COLORS } from '../constants';

export type GemColor = typeof GEM_COLORS[number];

export class PreviewQueue extends Container {
  private readonly _queueSize = 3;
  private readonly _cellSize = 80;
  private _queue: GemColor[] = [];

  constructor() {
    super();
    this.generateInitialQueue();
    this.rebuildQueueSprites();
  }

  private generateInitialQueue() {
    for (let i = 0; i < this._queueSize; i++) {
      this._queue.push(this.generateRandomGem());
    }
  }

  private generateRandomGem(): GemColor {
    const randomIndex = Math.floor(Math.random() * GEM_COLORS.length);
    return GEM_COLORS[randomIndex];
  }

  public rebuildQueueSprites() {
    this.removeChildren();

    for (let i = 0; i < this._queue.length; i++) {
      const gemColor = this._queue[i];
      const gemSprite = Sprite.from(`/assets/gem_${gemColor}.png`);

      gemSprite.x = 0;
      gemSprite.y = i * (this._cellSize + 10);
      gemSprite.anchor.set(0.5);
      gemSprite.x += this._cellSize / 2;
      gemSprite.y += this._cellSize / 2;

      const gemTargetSize = this._cellSize * 0.8;
      const gemScale = gemTargetSize / gemSprite.texture.width;
      gemSprite.scale.set(gemScale);

      // Interaction left to PlacementHandler
      (gemSprite as any).queueIndex = i;

      this.addChild(gemSprite);
    }

    this.x = window.innerWidth - this._cellSize - 50;
    this.y = 50;
  }

  public consumeGem(index: number, replacement?: GemColor): GemColor {
  const placedGem = this._queue[index];
  this._queue[index] = replacement ?? this.generateRandomGem();
  return placedGem;
}

  public get cellSize() {
    return this._cellSize;
  }

public get queueSize(): number {
  return this._queueSize;
}
  public getGemSprite(index: number): Sprite {
    return this.children[index] as Sprite;
  }

  public getGemColor(index: number): GemColor {
  return this._queue[index];
}
}