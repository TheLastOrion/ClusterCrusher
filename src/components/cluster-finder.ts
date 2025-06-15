import { GemColor } from './preview-queue';
import { Board } from './board';
import { Cluster } from '../interfaces/cluster';

export class ClusterFinder {
  private readonly _board: Board;
  private readonly _gridSize: number;
  private readonly _visited: boolean[][];

  constructor(board: Board) {
    this._board = board;
    this._gridSize = board.gridSize;
    this._visited = Array.from({ length: this._gridSize }, () =>
      Array(this._gridSize).fill(false)
    );
  }

  public findClusters(): Cluster[] {
    const clusters: Cluster[] = [];

    for (let row = 0; row < this._gridSize; row++) {
      for (let col = 0; col < this._gridSize; col++) {
        if (this._visited[row][col]) continue;

        const cell = this._board.getCell(row, col);
        if (!cell || !cell.color) continue;

        const clusterPositions = this.findClusterFromCell(row, col, cell.color);

        if (clusterPositions.length >= 3 && this.hasValidLine(clusterPositions)) {
          clusters.push({
            color: cell.color,
            positions: clusterPositions,
          });
        }
      }
    }

    return clusters;
  }

  private findClusterFromCell(row: number, col: number, color: GemColor): { row: number; col: number }[] {
    const queue: { row: number; col: number }[] = [{ row, col }];
    const cluster: { row: number; col: number }[] = [];
    this._visited[row][col] = true;

    while (queue.length > 0) {
      const { row: r, col: c } = queue.shift()!;
      cluster.push({ row: r, col: c });

      const neighbors = [
        { row: r - 1, col: c },
        { row: r + 1, col: c },
        { row: r, col: c - 1 },
        { row: r, col: c + 1 },
      ];

      for (const n of neighbors) {
        if (
          n.row >= 0 && n.row < this._gridSize &&
          n.col >= 0 && n.col < this._gridSize &&
          !this._visited[n.row][n.col]
        ) {
          const neighborCell = this._board.getCell(n.row, n.col);
          if (neighborCell && neighborCell.color === color) {
            this._visited[n.row][n.col] = true;
            queue.push(n);
          }
        }
      }
    }

    return cluster;
  }

  private hasValidLine(cluster: { row: number; col: number }[]): boolean {
    const rowMap = new Map<number, number[]>();
    const colMap = new Map<number, number[]>();

    // Group positions by row and column
    for (const pos of cluster) {
      if (!rowMap.has(pos.row)) rowMap.set(pos.row, []);
      rowMap.get(pos.row)!.push(pos.col);

      if (!colMap.has(pos.col)) colMap.set(pos.col, []);
      colMap.get(pos.col)!.push(pos.row);
    }

    // Check horizontal lines
    for (const [, cols] of rowMap) {
      cols.sort((a, b) => a - b);
      let count = 1;
      for (let i = 1; i < cols.length; i++) {
        if (cols[i] === cols[i - 1] + 1) {
          count++;
          if (count >= 3) return true;
        } else {
          count = 1;
        }
      }
    }

    // Check vertical lines
    for (const [, rows] of colMap) {
      rows.sort((a, b) => a - b);
      let count = 1;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i] === rows[i - 1] + 1) {
          count++;
          if (count >= 3) return true;
        } else {
          count = 1;
        }
      }
    }

    return false;
  }
}