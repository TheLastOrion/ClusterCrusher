import { Container, Text, TextStyle } from 'pixi.js';
import { useGameStore } from '../store';

export class HUD extends Container {
  private _scoreText: Text;
  private _movesText: Text;

  constructor() {
    super();

    const textStyle = new TextStyle({
      fill: '#ffffff',
      fontSize: 28,
    });

    this._scoreText = new Text('Score: 0', textStyle);
    this._movesText = new Text('Moves: 25', textStyle);

    this._scoreText.x = 30;
    this._scoreText.y = 30;

    this._movesText.x = 30;
    this._movesText.y = 70;

    this.addChild(this._scoreText);
    this.addChild(this._movesText);

    this.update();
  }

  public update() {
    const state = useGameStore.getState();

    this._scoreText.text = `Score: ${state.score}`;
    this._movesText.text = `Moves: ${state.moves}`;
  }
}