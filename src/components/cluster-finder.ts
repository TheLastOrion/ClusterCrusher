import { Board } from "./board";
import { Cluster } from "../interfaces/cluster";
import { GemColor } from "./preview-queue";

export class ClusterFinder {
  private readonly _board: Board;
  private readonly _gridSize: number;

  constructor(board: Board) {
    this._board = board;
    this._gridSize = board.gridSize;
  }

  public findClusters(): Cluster[] {
    const visited = Array.from({ length: this._gridSize }, () =>
      Array(this._gridSize).fill(false)
    );

    const clusters: Cluster[] = [];

    for (let row = 0; row < this._gridSize; row++) {
      for (let col = 0; col < this._gridSize; col++) {
        if (visited[row][col]) continue;

        const cell = this._board.getCell(row, col);
        if (!cell || !cell.color) continue;

        const cluster = this.findClusterFromCell(row, col, cell.color, visited);

        if (cluster.length >= 3) {
          clusters.push({
            color: cell.color,
            positions: cluster,
          });
        }
      }
    }

    return clusters;
  }

  private findClusterFromCell(row: number, col: number, color: GemColor, visited: boolean[][]): { row: number; col: number }[] {
    const queue: { row: number; col: number }[] = [{ row, col }];
    const cluster: { row: number; col: number }[] = [];
    visited[row][col] = true;

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
          n.row >= 0 &&
          n.row < this._gridSize &&
          n.col >= 0 &&
          n.col < this._gridSize &&
          !visited[n.row][n.col]
        ) {
          const neighborCell = this._board.getCell(n.row, n.col);
          if (neighborCell && neighborCell.color === color) {
            visited[n.row][n.col] = true;
            queue.push(n);
          }
        }
      }
    }

    return cluster;
  }
}