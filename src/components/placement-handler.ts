import { FederatedPointerEvent, Sprite, Container } from 'pixi.js';
import { Board } from './board';
import { PreviewQueue } from './preview-queue';

export class PlacementHandler {
  private readonly _board: Board;
  private readonly previewQueue: PreviewQueue;
  private _draggedGem: Sprite | null = null;
  private _draggedIndex: number | null = null;

  constructor(board: Board, previewQueue: PreviewQueue) {
    this._board = board;
    this.previewQueue = previewQueue;

    this.setupBoardDropTargets();
    this.setupPreviewDragging();
  }

  private setupPreviewDragging() {
    for (let i = 0; i < this.previewQueue.queueSize; i++) {
      const gemSprite = this.previewQueue.getGemSprite(i);

      gemSprite.interactive = true;
      gemSprite.cursor = 'grab';
      gemSprite.eventMode = 'static';

      gemSprite.on('pointerdown', (e: FederatedPointerEvent) => {
        this.onDragStart(e, gemSprite);
      });

      gemSprite.on('pointermove', (e: FederatedPointerEvent) => {
        this.onDragMove(e);
      });

      gemSprite.on('pointerup', (e: FederatedPointerEvent) => {
        this.onDragEnd(e);
      });

      gemSprite.on('pointerupoutside', (e: FederatedPointerEvent) => {
        this.onDragEnd(e);
      });
    }
  }

  private onDragStart(e: FederatedPointerEvent, gem: Sprite) {
    this._draggedGem = gem;
    this._draggedIndex = (gem as any).queueIndex;

    gem.alpha = 0.7;
    gem.zIndex = 999;
    gem.parent.addChild(gem); // bring to top
    gem.eventMode = 'dynamic';
  }

  private onDragMove(e: FederatedPointerEvent) {
    if (!this._draggedGem) return;

    const newPos = e.global;
    this._draggedGem.x = newPos.x;
    this._draggedGem.y = newPos.y;
  }

  private onDragEnd(e: FederatedPointerEvent) {
    if (!this._draggedGem || this._draggedIndex === null) return;

    const globalPos = e.global;
    const boardPos = this._board.toLocal(globalPos);

    const targetCol = Math.floor(boardPos.x / this._board.cellSize);
    const targetRow = Math.floor(boardPos.y / this._board.cellSize);

    if (
      targetRow >= 0 && targetRow < this._board.gridSize &&
      targetCol >= 0 && targetCol < this._board.gridSize
    ) {
      const gemColor = this.previewQueue.consumeGem(this._draggedIndex);
      this._board.placeGem(targetRow, targetCol, gemColor);
      console.log(`Placed ${gemColor} at (${targetRow}, ${targetCol})`);
    }

    this._draggedGem.alpha = 1;
    this._draggedGem = null;
    this._draggedIndex = null;

    // Fully rebuild queue and rewire events:
    this.previewQueue.rebuildQueueSprites();
    this.setupPreviewDragging();
  }

  private setupBoardDropTargets() {
    for (let row = 0; row < this._board.gridSize; row++) {
      for (let col = 0; col < this._board.gridSize; col++) {
        const cellContainer = this._board.getCellContainer(row, col);
        cellContainer.interactive = true;
        cellContainer.eventMode = 'static';
      }
    }
  }
}