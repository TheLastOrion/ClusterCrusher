import { Container, Text, TextStyle } from 'pixi.js';
import { useGameStore } from '../store';

export class HUD extends Container {
  private scoreText: Text;
  private movesText: Text;

  constructor() {
    super();

    const textStyle = new TextStyle({
      fill: '#ffffff',
      fontSize: 28,
    });

    this.scoreText = new Text('Score: 0', textStyle);
    this.movesText = new Text('Moves: 25', textStyle);

    this.scoreText.x = 30;
    this.scoreText.y = 30;

    this.movesText.x = 30;
    this.movesText.y = 70;

    this.addChild(this.scoreText);
    this.addChild(this.movesText);

    this.update();
  }

  public update() {
    const state = useGameStore.getState();

    this.scoreText.text = `Score: ${state.score}`;
    this.movesText.text = `Moves: ${state.moves}`;
  }
}