import {GridEngine} from 'grid-engine';
import Phaser from 'phaser';
import {Stage} from './Stage';

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
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
};

const main = new Phaser.Game(gameConfig);

main.scene.add('stage', stage);
main.scene.start('stage');
