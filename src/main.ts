import { Application } from 'pixi.js';
import { useGameStore } from './store';

const app = new Application({
  resizeTo: window,
  backgroundColor: 0x222222,
  antialias: true,
});

document.body.appendChild(app.view as HTMLCanvasElement);

const state = useGameStore.getState();
console.log('Initial moves:', state.moves);

function init() {
  console.log('Cluster Crusher initialized');
}

init();