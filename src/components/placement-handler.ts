import { FederatedPointerEvent, Sprite, Container, Point } from 'pixi.js';
import { Board } from './board';
import { PreviewQueue, GemColor } from './preview-queue';
import { ClusterFinder } from './cluster-finder';
import { useGameStore } from '../store';
import { Cluster } from '../interfaces/cluster';


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

    // console.log(`Dragging at: x=${e.global.x}, y=${e.global.y}`);
  }

  private onDragEnd(e: FederatedPointerEvent): void {
  if (!this._draggedGem || this._draggedIndex === null || this._draggedColor === null) return;

  const globalPos = e.global;
  const boardPos = this._board.toLocal(globalPos);

  const targetCol = Math.floor(boardPos.x / this._board.cellSize);
  const targetRow = Math.floor(boardPos.y / this._board.cellSize);

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
  let clusters: Cluster[];

  const useStrictPlacementDetection = true;

  if (useStrictPlacementDetection) {
    clusters = clusterFinder.findClusters(
      true, 
      targetRow, 
      targetCol, 
      this._draggedColor
    );
  } else {
    clusters = clusterFinder.findClusters(false);
  }

  const validClusters = clusters.filter(cluster =>
    cluster.color === this._draggedColor &&
    cluster.positions.some(pos => pos.row === targetRow && pos.col === targetCol)
  );

  if (validClusters.length > 0) {
    console.log('Clusters found:', validClusters);

    if (previousGem) {
      targetCell.removeChild(previousGem);
      previousGem.destroy();
    }

    this._board.crushClusters(validClusters);
    this._board.refillBoard();

    // Calculate score using formula: (N - 2)^2 × 10
    let totalScore = 0;
    for (const cluster of validClusters) {
      const clusterSize = cluster.positions.length;
      const clusterScore = Math.pow(clusterSize - 2, 2) * 10;
      totalScore += clusterScore;
    }

    useGameStore.getState().addScore(totalScore);
    useGameStore.getState().useMove();

    this._previewQueue.consumeGem(this._draggedIndex);
    this._previewQueue.rebuildQueueSprites();
    this.setupPreviewQueueInteractions();

  } else {
    console.log('No valid cluster — invalid move, undoing placement.');

    targetCell.removeChild(this._draggedGem);

    if (previousGem) {
      targetCell.addChild(previousGem);
    }

    this.snapBackToPreview();

    // Check for reshuffling if no valid moves are left
    this.reshuffleIfNeeded();  // This will now check and reshuffle the board if needed
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
  
  private canMakeValidMove(): boolean {
  const clusterFinder = new ClusterFinder(this._board);
  const allPossibleMoves: { row: number, col: number }[] = [];

  // Check each gem in the preview queue
  for (let i = 0; i < this._previewQueue.queueSize; i++) {
    const gemColor = this._previewQueue.getGemColor(i);
    
    // Try placing this gem at each empty spot on the board
    for (let row = 0; row < this._board.gridSize; row++) {
      for (let col = 0; col < this._board.gridSize; col++) {
        const targetCell = this._board.getCell(row, col);
        if (!targetCell.color) {  // Check only empty cells
          // Temporarily place the gem
          this._board.setCell(row, col, gemColor, targetCell.sprite);

          // Check if any clusters form
          const clusters = clusterFinder.findClusters(false);
          if (clusters.length > 0) {
            return true;  // Valid move found
          }

          // Reset the placement if no clusters
          this._board.setCell(row, col, '', targetCell.sprite);  // Assuming empty string means no gem
        }
      }
    }
  }

  return false;  // No valid moves found
}

private reshuffleBoard(): boolean {
  let attempts = 0;
  const maxAttempts = 10;

  // Try reshuffling up to 10 times
  while (attempts < maxAttempts) {
    this._board.refillBoard();
    const clusterFinder = new ClusterFinder(this._board);
    const clusters = clusterFinder.findClusters(false); // No strict placement mode

    if (clusters.length > 0) {
      return true; // Successfully reshuffled with valid clusters
    }

    attempts++;
  }

  return false; // Failed to reshuffle within max attempts
}
private reshuffleIfNeeded(): void {
  const validMove = this.canMakeValidMove();

  if (!validMove) {
    console.log('No valid moves — reshuffling the board!');
    const reshuffleSuccess = this.reshuffleBoard();
    if (reshuffleSuccess) {
      console.log('Board reshuffled successfully.');
    } else {
      console.log('Failed to reshuffle after max attempts.');
    }
  }
  else {
    console.log('A valid move is found');
  }
}
}