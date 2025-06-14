import { Container, Text, TextStyle, Assets } from 'pixi.js';

export class LoaderScene extends Container {
  constructor(onLoaded: () => void) {
    super();

    const loadingText = new Text('Loading...', new TextStyle({
      fill: '#ffffff',
      fontSize: 32,
    }));

    loadingText.anchor.set(0.5);
    loadingText.x = window.innerWidth / 2;
    loadingText.y = window.innerHeight / 2;

    this.addChild(loadingText);

    // Start loading assets
    this.loadAssets(onLoaded);
  }

  private async loadAssets(onLoaded: () => void) {
    await Assets.load([
      '/assets/gem_yellow.png',
      '/assets/gem_blue.png',
      '/assets/gem_green.png',
      '/assets/gem_pink.png',
      '/assets/button.png',
      '/assets/modal.png',
      '/assets/info.png',
      '/assets/cell.png',
    ]);

    // Call the callback when loading is done
    onLoaded();
  }
}