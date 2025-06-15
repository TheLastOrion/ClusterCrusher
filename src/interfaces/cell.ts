import { Sprite } from 'pixi.js';
import { GEM_COLORS } from '../constants';

export interface Cell {
  sprite: Sprite;
  color: GemColor;
}

export type GemColor = typeof GEM_COLORS[number];
