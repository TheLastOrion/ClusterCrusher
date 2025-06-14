import { Container, Sprite } from 'pixi.js';
import type { FederatedPointerEvent } from '@pixi/events';
import { Board } from './board';

export class InputHandler {
  private readonly _board: Board;
  private draggedGem: Sprite | null = null;
  private startX = 0;
  private startY = 0;

  constructor(board: Board) {
    this._board = board;
    this.setupInput();
  }

  private setupInput() {
    for (let row = 0; row < this._board.gridSize; row++) {
      for (let col = 0; col < this._board.gridSize; col++) {
        const cell = this._board.getCell(row, col);
        const gemSprite = cell.sprite;

        gemSprite.interactive = true;
        gemSprite.cursor = 'pointer';

        gemSprite.on('pointerdown', (e: FederatedPointerEvent) => this.onDragStart(e, gemSprite));
        gemSprite.on('pointerup', () => this.onDragEnd());
        gemSprite.on('pointerupoutside', () => this.onDragEnd());
        gemSprite.on('pointermove', (e: FederatedPointerEvent) => this.onDragMove(e));
      }
    }
  }

  private onDragStart(e: FederatedPointerEvent, gem: Sprite) {
    this.draggedGem = gem;
    this.startX = gem.x;
    this.startY = gem.y;
    gem.alpha = 0.7;
  }

  private onDragMove(e: FederatedPointerEvent) {
    if (!this.draggedGem) return;

    const newPosition = e.getLocalPosition(this.draggedGem.parent);
    this.draggedGem.x = newPosition.x;
    this.draggedGem.y = newPosition.y;
  }

  private onDragEnd() {
    if (!this.draggedGem) return;

    this.draggedGem.x = this.startX;
    this.draggedGem.y = this.startY;
    this.draggedGem.alpha = 1;

    this.draggedGem = null;
  }
}