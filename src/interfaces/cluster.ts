import { GemColor } from '../components/preview-queue'

export interface Cluster {
  color: GemColor;
  positions: { row: number; col: number }[];
}