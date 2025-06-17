import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { useGameStore } from '../store';

export class EndGameModal extends Container {
  private readonly _messageText: Text;
  private readonly _restartButton: Graphics;
  private readonly _buttonText: Text;

  constructor() {
    super();

    // Background overlay
    const bg = new Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    bg.endFill();
    this.addChild(bg);

    const textStyle = new TextStyle({
      fill: '#ffffff',
      fontSize: 48,
    });

    this._messageText = new Text('', textStyle);
    this._messageText.anchor.set(0.5);
    this._messageText.x = window.innerWidth / 2;
    this._messageText.y = window.innerHeight / 2 - 100;
    this.addChild(this._messageText);

    // Restart button
    this._restartButton = new Graphics();
    this._restartButton.beginFill(0x4444aa);
    this._restartButton.drawRoundedRect(0, 0, 250, 80, 20);
    this._restartButton.endFill();
    this._restartButton.x = (window.innerWidth - 250) / 2;
    this._restartButton.y = window.innerHeight / 2;
    this._restartButton.interactive = true;
    this._restartButton.cursor = 'pointer';
    this.addChild(this._restartButton);

    this._buttonText = new Text('Restart', {
      fill: '#ffffff',
      fontSize: 32,
    });
    this._buttonText.anchor.set(0.5);
    this._buttonText.x = this._restartButton.x + 125;
    this._buttonText.y = this._restartButton.y + 40;
    this.addChild(this._buttonText);

    this._restartButton.on('pointerdown', () => {
      useGameStore.getState().resetGame();
      this.visible = false;
    });

    this.visible = false;
  }

  public update(): void {
    const { gameStatus } = useGameStore.getState();

    // Show message based on game status (after 25 moves)
    if (gameStatus === 'won') {
      this._messageText.text = 'You Win!';
      this.visible = true;
    } else if (gameStatus === 'lost') {
      this._messageText.text = 'Game Over';
      this.visible = true;
    } else {
      this.visible = false;
    }
  }
}