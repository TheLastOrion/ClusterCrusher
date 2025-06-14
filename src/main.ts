import { Application } from 'pixi.js';
import { LoaderScene } from './scenes/loader-scene';
import { Board } from './components/board';
import { PreviewQueue } from './components/preview-queue';
import { useGameStore } from './store';
import { HUD } from './components/hud';
import { initDevtools } from '@pixi/devtools';
import { InputHandler } from './components/input-handler';
import { PlacementHandler } from './components/placement-handler';
// Create Pixi Application
const app = new Application({
  resizeTo: window,
  backgroundColor: 0x222222,
  antialias: true,
});
document.body.appendChild(app.view as HTMLCanvasElement);

initDevtools({
  app,
});
const state = useGameStore.getState();
console.log('Initial moves:', state.moves);

// Start loader
const loaderScene = new LoaderScene(() => {
  console.log('Assets loaded, starting game.');

  const board = new Board();
  app.stage.addChild(board);

  const previewQueue = new PreviewQueue();
  app.stage.addChild(previewQueue);

  // const inputHandler = new InputHandler(board);
  
  const hud = new HUD();
  app.stage.addChild(hud);

  const placementHandler = new PlacementHandler(board, previewQueue);


  // Optional live updating (can later be optimized via Zustand subscriptions)
  app.ticker.add(() => {
    hud.update();
  });
});

app.stage.addChild(loaderScene);
