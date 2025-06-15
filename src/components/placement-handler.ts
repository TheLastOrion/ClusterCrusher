import { FederatedPointerEvent, Sprite, Container, Point } from 'pixi.js';
import { Board } from './board';
import { PreviewQueue, GemColor } from './preview-queue';
import { ClusterFinder } from './cluster-finder';

export class PlacementHandler {
  private readonly _stage: Container;
  private readonly _board: Board;
  private readonly _previewQueue: PreviewQueue;

  private _draggedGem: Sprite | null = null;
  private _draggedIndex: number | null = null;
  private _draggedColor: GemColor | null = null;
  private _originalPreviewPosition: Point | null = null;
  constructor(stage: Container, board: Board, previewQueue: PreviewQueue) {
    this._stage = stage;
    this._board = board;
    this._previewQueue = previewQueue;

    this._stage.eventMode = 'static';
    this._stage.hitArea = this._stage.getBounds();

    this.setupBoardDropTargets();
    this.setupPreviewQueueInteractions();

    this._stage.on('pointerup', this.onDragEnd, this);
    this._stage.on('pointerupoutside', this.onDragEnd, this);
  }

  private setupPreviewQueueInteractions(): void {
    for (let i = 0; i < this._previewQueue.queueSize; i++) {
      const gemSprite = this._previewQueue.getGemSprite(i);
      gemSprite.interactive = true;
      gemSprite.cursor = 'grab';
      gemSprite.eventMode = 'static';

      gemSprite.on('pointerdown', (e: FederatedPointerEvent) => {
        this.onDragStart(e, gemSprite, i);
      });
    }
  }

  private onDragStart(e: FederatedPointerEvent, gem: Sprite, index: number): void {
    this._originalPreviewPosition = gem.getGlobalPosition();

    this._draggedGem = gem;
    this._draggedIndex = index;
    this._draggedColor = this._previewQueue.getGemColor(index);

    gem.alpha = 0.7;
    gem.zIndex = 999;

    const globalPos = gem.getGlobalPosition();
    this._previewQueue.removeChild(gem);
    this._stage.addChild(gem);
    gem.position.set(globalPos.x, globalPos.y);
    gem.eventMode = 'dynamic';

    this._stage.on('pointermove', this.onDragMove, this);

    console.log(`Drag started for index: ${index}, color: ${this._draggedColor}`);
  }

  private onDragMove(e: FederatedPointerEvent): void {
    if (!this._draggedGem) return;

    this._draggedGem.x = e.global.x;
    this._draggedGem.y = e.global.y;

    console.log(`Dragging at: x=${e.global.x}, y=${e.global.y}`);
  }

  private onDragEnd(e: FederatedPointerEvent): void {
  if (!this._draggedGem || this._draggedIndex === null || this._draggedColor === null) return;

  const globalPos = e.global;
  const boardPos = this._board.toLocal(globalPos);

  const targetCol = Math.floor(boardPos.x / this._board.cellSize);
  const targetRow = Math.floor(boardPos.y / this._board.cellSize);

  console.log(`Drag ended at: x=${globalPos.x}, y=${globalPos.y}`);
  console.log(`Calculated target: row=${targetRow}, col=${targetCol}`);

  // Check board bounds first
  if (
    targetRow < 0 || targetRow >= this._board.gridSize ||
    targetCol < 0 || targetCol >= this._board.gridSize
  ) {
    console.log('Drop outside board boundaries, canceling move.');
    this.snapBackToPreview();
    this.cleanupDrag();
    return;
  }

  const targetCell = this._board.getCellContainer(targetRow, targetCol);

  // Store any previous gem (if exists)
  const previousGem = targetCell.children.length > 1
    ? targetCell.getChildAt(1) as Sprite
    : null;

  this._stage.removeChild(this._draggedGem);
  targetCell.addChild(this._draggedGem);

  this._draggedGem.x = this._board.cellSize / 2;
  this._draggedGem.y = this._board.cellSize / 2;
  this._draggedGem.alpha = 1;
  this._draggedGem.eventMode = 'none';

  this._board.setCell(targetRow, targetCol, this._draggedColor, this._draggedGem);

  const clusterFinder = new ClusterFinder(this._board);
  const clusters = clusterFinder.findClusters();

  const involved = clusters.some(cluster =>
    cluster.positions.some(pos => pos.row === targetRow && pos.col === targetCol)
  );

  if (clusters.length > 0 && involved) {
    console.log('Clusters found:', clusters);

    if (previousGem) {
      targetCell.removeChild(previousGem);
      previousGem.destroy();
    }

    this._board.crushClusters(clusters);
    this._board.refillBoard();

    this._previewQueue.consumeGem(this._draggedIndex);
    this._previewQueue.rebuildQueueSprites();
    this.setupPreviewQueueInteractions();

  } else {
    console.log('No valid cluster — invalid move, undoing placement.');

    // Undo provisional placement: restore previous state
    targetCell.removeChild(this._draggedGem);

    if (previousGem) {
      targetCell.addChild(previousGem);
    }

    this.snapBackToPreview();
  }

  console.log(`Placement finalized: row=${targetRow}, col=${targetCol}`);
  this.cleanupDrag();
}

  private snapBackToPreview(): void {
    this._previewQueue.addChild(this._draggedGem!);
    this._draggedGem!.x = this._previewQueue.cellSize / 2;
    this._draggedGem!.y = this._draggedIndex! * (this._previewQueue.cellSize + 10) + this._previewQueue.cellSize / 2;
    this._draggedGem!.alpha = 1;
    this._draggedGem!.eventMode = 'static';
  }

  private cleanupDrag(): void {
    this._stage.off('pointermove', this.onDragMove, this);
    this._draggedGem = null;
    this._draggedIndex = null;
    this._draggedColor = null;
  }
  private setupBoardDropTargets(): void {
    for (let row = 0; row < this._board.gridSize; row++) {
      for (let col = 0; col < this._board.gridSize; col++) {
        const cellContainer = this._board.getCellContainer(row, col);
        cellContainer.interactive = true;
        cellContainer.eventMode = 'static';
      }
    }
  }
}