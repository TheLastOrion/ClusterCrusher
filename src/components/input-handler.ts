import { Board } from './board';
import { Sprite, Container, FederatedPointerEvent } from 'pixi.js';

export class InputHandler {
  private readonly _board: Board;
  private _draggedGem: Sprite | null = null;
  private _startRow = 0;
  private _startCol = 0;

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

        gemSprite.on('pointerdown', (e: FederatedPointerEvent) => this.onDragStart(e, gemSprite, row, col));
        gemSprite.on('pointerup', (e: FederatedPointerEvent) => this.onDragEnd(e));
        gemSprite.on('pointerupoutside', (e: FederatedPointerEvent) => this.onDragEnd(e));
      }
    }
  }

  private onDragStart(e: FederatedPointerEvent, gem: Sprite, row: number, col: number) {
    this._draggedGem = gem;
    this._startRow = row;
    this._startCol = col;

    gem.alpha = 0.7;
  }

  private onDragEnd(e: FederatedPointerEvent) {
    if (!this._draggedGem) return;

    const globalPos = e.global;
    const boardPos = this._board.toLocal(globalPos);

    const targetCol = Math.floor(boardPos.x / this._board.cellSize);
    const targetRow = Math.floor(boardPos.y / this._board.cellSize);

    // Check bounds
    if (
      targetRow >= 0 && targetRow < this._board.gridSize &&
      targetCol >= 0 && targetCol < this._board.gridSize
    ) {
      const distance = Math.abs(targetRow - this._startRow) + Math.abs(targetCol - this._startCol);

      if (distance === 1) {
        this.swapGems(this._startRow, this._startCol, targetRow, targetCol);
      }
    }

    this.resetDraggedGem();
  }

  private swapGems(row1: number, col1: number, row2: number, col2: number) {
    const cell1 = this._board.getCell(row1, col1);
    const cell2 = this._board.getCell(row2, col2);

    // Swap sprites visually:
    const tempPos = { x: cell1.sprite.x, y: cell1.sprite.y };
    cell1.sprite.x = cell2.sprite.x;
    cell1.sprite.y = cell2.sprite.y;
    cell2.sprite.x = tempPos.x;
    cell2.sprite.y = tempPos.y;

    // Swap internal references:
    [this._board.cells[row1][col1], this._board.cells[row2][col2]] =
      [this._board.cells[row2][col2], this._board.cells[row1][col1]];
  }

  private resetDraggedGem() {
    if (this._draggedGem) {
      this._draggedGem.alpha = 1;
      this._draggedGem = null;
    }
  }
}