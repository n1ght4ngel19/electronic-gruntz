import { GridEngine } from 'grid-engine';
import Phaser from 'phaser';
import { Stage } from './scenes/Stage';

const stage = new Stage();

const gameConfig = {
  type: Phaser.AUTO,
  autoCenter: true,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  // BUG: Framerate is too fast, thus most commands get executed multiple times when called, instead of once.
  // Temporary fix: limited framerate to 10fps, so commands can be tested
  // Possible fix: disassociate clicks/commands from framerate altogether
  fps: {
    target: 10,
    forceSetTimeOut: true,
  },
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
    ],
  },
};

const main = new Phaser.Game(gameConfig);

main.scene.add('stage', stage);
main.scene.start('stage');
