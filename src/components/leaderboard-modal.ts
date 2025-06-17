import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { loadLeaderboard } from './leaderboard';

export class LeaderboardModal extends Container {
  private readonly _leaderboardText: Text;

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
      fontSize: 32,
    });

    // Create leaderboard text with corrected positioning
    this._leaderboardText = new Text('Leaderboard:', textStyle);
    this._leaderboardText.anchor.set(0.5); // Center the text
    this._leaderboardText.position.set(window.innerWidth / 2, 50); // Correct positioning
    this.addChild(this._leaderboardText);

    this.displayLeaderboard();
  }

  private displayLeaderboard() {
    const leaderboard = loadLeaderboard();
    const leaderboardText = leaderboard
      .map((entry: { score: number; date: string }, index: number) => {
        return `${index + 1}. Score: ${entry.score} - Date: ${entry.date}`;
      })
      .join('\n');

    const textStyle = new TextStyle({
      fill: '#ffffff',
      fontSize: 24,
    });

    // Create leaderboard display text with corrected positioning
    const leaderboardDisplay = new Text(leaderboardText, textStyle);
    leaderboardDisplay.anchor.set(0.5);
    leaderboardDisplay.position.set(window.innerWidth / 2, 100); // Correct positioning
    this.addChild(leaderboardDisplay);
  }
}