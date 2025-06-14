import { Container, Sprite } from 'pixi.js';

const GEM_COLORS = ['blue', 'green', 'pink'] as const;
type GemColor = typeof GEM_COLORS[number];

export class PreviewQueue extends Container {
  private readonly _queueSize = 3;
  private readonly _cellSize = 80;
  private queue: GemColor[] = [];

  constructor() {
    super();
    this.buildQueue();
  }

  private buildQueue() {
    this.queue = this.generateQueue();

    for (let i = 0; i < this.queue.length; i++) {
      const gemColor = this.queue[i];
      const gemSprite = Sprite.from(`/assets/gem_${gemColor}.png`);

      gemSprite.x = 0;
      gemSprite.y = i * (this._cellSize + 10);
      gemSprite.anchor.set(0.5, 0.5);
      gemSprite.x += this._cellSize / 2;
      gemSprite.y += this._cellSize / 2;

      const gemTargetSize = this._cellSize * 0.8;
      const gemScale = gemTargetSize / gemSprite.texture.width;
      gemSprite.scale.set(gemScale);

      this.addChild(gemSprite);
    }

    // Position it top-right for now
    this.x = window.innerWidth - this._cellSize - 50;
    this.y = 50;
  }

  private generateQueue(): GemColor[] {
    const result: GemColor[] = [];
    for (let i = 0; i < this._queueSize; i++) {
      const randomIndex = Math.floor(Math.random() * GEM_COLORS.length);
      result.push(GEM_COLORS[randomIndex]);
    }
    return result;
  }
}