import { GridEngine } from 'grid-engine';
import Phaser, { Display } from 'phaser';
import { Stage } from './scenes/Stage';

const stage = new Stage();

const gameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
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
// main.scene.add('updateScene', updateScene);

main.scene.start('stage');
// main.scene.start('updateScene');
