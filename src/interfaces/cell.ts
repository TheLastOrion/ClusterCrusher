import { Sprite } from 'pixi.js';

export interface Cell {
  sprite: Sprite;
  color: 'blue' | 'green' | 'pink';
}