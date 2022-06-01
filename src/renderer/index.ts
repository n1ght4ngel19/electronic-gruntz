import Phaser from 'phaser';
import { PreloadScene } from './scenes/preloadScene';

const preloadScene = new PreloadScene();

const gameConfig = {
  type: Phaser.AUTO
};

const game = new Phaser.Game(gameConfig);

game.scene.add('preloadScene', preloadScene);

game.scene.start('preloadScene');



(document.getElementById('counter') as HTMLParagraphElement).innerHTML =
  'Edit the files and save to reload.';

let count: number = 0;

const render = (): void => {
  (document.getElementById('counter') as HTMLParagraphElement)
  .innerHTML = `Page has been open for <code>${count}</code> seconds.`;
};

render();

setInterval((): void => {
  count += 1;
  render();
}, 1000);