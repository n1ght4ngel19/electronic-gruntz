import { GridEngine } from 'grid-engine';
import Phaser from 'phaser';
import { Stage } from './scenes/stage';

const stage = new Stage();

const gameConfig = {
  gameTitle: 'Electronic Gruntz',
  gameVersion: '0.0.1',
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  roundPixels: true,
  disableContextMenu: true,
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
    ],
  },
  autoCenter: true,
  // BUG: Framerate is too fast, thus most commands get executed multiple times when called, instead of once.
  // Temporary fix: limited framerate to 10fps, so commands can be tested
  // Possible fix: disassociate clicks/commands from framerate altogether
  fps: {
    target: 30,
    forceSetTimeOut: true,
  },
};

const main = new Phaser.Game(gameConfig);

main.scene.add('stage', stage);
main.scene.start('stage');
