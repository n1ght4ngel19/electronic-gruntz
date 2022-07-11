import Phaser from 'phaser';
import {GridEngine} from 'grid-engine';
import Tilemap = Phaser.Tilemaps.Tilemap;
import Key = Phaser.Input.Keyboard.Key;
import {AnimationCreator} from './presentationHandlers/AnimationCreator';
import {AnimationHandler} from './presentationHandlers/AnimationHandler';
import {CameraHandler} from './actionHandlers/CameraHandler';
import {PauseMenuHandler} from './PauseMenuHandler';
import {CommandHandler} from './actionHandlers/CommandHandler';
import {Grunt} from './gruntz/Grunt';
import {GruntType} from './gruntz/GruntType';
import Tileset = Phaser.Tilemaps.Tileset;
import {AssetHandler} from './AssetHandler';

const searchParams = new URLSearchParams(window.location.search);
const mapName = String(searchParams.get('stage'));
const tilesetName = String(searchParams.get('tileset'));

export class Stage extends Phaser.Scene {
  /**
   * Constructor
   */
  constructor() {
    super({key: 'stage'});
  }

  assetHandler = new AssetHandler(this);
  cameraHandler = new CameraHandler(this);
  animationHandler = new AnimationHandler(this);
  animationCreator = new AnimationCreator(this);
  pauseMenuHandler = new PauseMenuHandler(this);
  commandHandler = new CommandHandler(this);

  gridEngine!: GridEngine;

  upArrowKey!: Key;
  downArrowKey!: Key;
  leftArrowKey!: Key;
  rightArrowKey!: Key;

  wButtonKey!: Key;
  sButtonKey!: Key;
  aButtonKey!: Key;
  dButtonKey!: Key;

  map!: Tilemap;
  mapWidth!: number;
  mapHeight!: number;

  baseLayer!: Tileset;
  generalLayer!: Tileset;
  brickLayer!: Tileset;
  markerLayer!: Tileset;
  switchLayer!: Tileset;

  playerGruntz: Grunt[] = [];
  playerGruntzPositionz: {
    x: number,
    y: number
  }[] = [];


  /**
   * Preload
   */
  preload(): void {
    this.assetHandler.loadMapAndTilesets(mapName, tilesetName);
    this.assetHandler.loadAnimationAtlases();
  }


  /**
   * Create
   */
  create(): void {
    this.upArrowKey = this.input.keyboard.addKey('UP');
    this.downArrowKey = this.input.keyboard.addKey('DOWN');
    this.leftArrowKey = this.input.keyboard.addKey('LEFT');
    this.rightArrowKey = this.input.keyboard.addKey('RIGHT');

    this.wButtonKey = this.input.keyboard.addKey('W');
    this.sButtonKey = this.input.keyboard.addKey('S');
    this.aButtonKey = this.input.keyboard.addKey('A');
    this.dButtonKey = this.input.keyboard.addKey('D');

    const normalGruntAtlas = this.textures.get('NORMALGRUNT');
    this.animationCreator.createAtlasAnimations(normalGruntAtlas.key, GruntType.normalGrunt);

    this.map = this.assetHandler.makeMapWithLayers(mapName, tilesetName);
    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;

    for (let i = 0; i < this.map.getLayer('markerLayer').width; i++) {
      for (let j = 0; j < this.map.getLayer('markerLayer').height; j++) {
        if (this.map.getTileAt(i, j, true, 'markerLayer').properties.gruntType) {
          this.playerGruntzPositionz.push({x: i, y: j});
          console.log(this.map.getTileAt(i, j, true, 'markerLayer').properties.gruntType);
        }
      }
    }

    this.playerGruntz[0] = this.add.existing(new Grunt(this, 0, 0, normalGruntAtlas, false, 'grunt1'));
    this.playerGruntz[1] = this.add.existing(new Grunt(this, 0, 0, normalGruntAtlas, false, 'grunt2'));
    // player.scale = 1.5;
    for (let i = 0; i < this.playerGruntz.length; i++) {
      this.playerGruntz[i].anims.play('normalGruntSouthIdle');
    }


    const gridEngineConfig = {
      characters: [],
      numberOfDirections: 8,
    };

    const grunt1 = {
      id: this.playerGruntz[0].id,
      sprite: this.playerGruntz[0],
      startPosition: this.playerGruntzPositionz[0],
      speed: 4,
      // speed: Math.floor(10/6),
    };

    const grunt2 = {
      id: this.playerGruntz[1].id,
      sprite: this.playerGruntz[1],
      startPosition: this.playerGruntzPositionz[1],
      speed: 4,
      // speed: Math.floor(10/6),
    };

    gridEngineConfig.characters.push(grunt1);
    gridEngineConfig.characters.push(grunt2);

    this.gridEngine.create(this.map, gridEngineConfig);

    this.animationHandler.handleIdleAnimations(this.playerGruntz, GruntType.normalGrunt);

    this.cameraHandler.setDefaultCameraSettings(this.cameras.main, this.mapWidth, this.mapHeight);
    this.cameraHandler.handleZoom(this.cameras.main, this.mapWidth);

    this.pauseMenuHandler.handlePause();
    this.selectGruntzWithKeys();
  }


  /**
   * Update
   */
  update(): void {
    this.animationHandler.handleWalkingAnimations(this.playerGruntz, GruntType.normalGrunt);

    this.cameraHandler.handleCameraEdgeScroll(this.cameras.main, 15);
    this.cameraHandler.handleCameraKeysScroll(this.cameras.main, 15);

    this.commandHandler.handleMoveCommand(this.playerGruntz);
    this.commandHandler.handleMoveArrows(this.playerGruntz);
  }

  selectGruntzWithKeys(): void {
    this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case '0': {
          for (let i = 0; i < this.playerGruntz.length; i++) {
            this.playerGruntz[i].isSelected = false;
          }

          break;
        }
        case '1': {
          for (let i = 0; i < this.playerGruntz.length; i++) {
            this.playerGruntz[i].isSelected = false;
          }

          this.playerGruntz[0].isSelected = true;
          break;
        }
        case '2': {
          for (let i = 0; i < this.playerGruntz.length; i++) {
            this.playerGruntz[i].isSelected = false;
          }

          this.playerGruntz[1].isSelected = true;
          break;
        }
        case '3': {
          for (let i = 0; i < this.playerGruntz.length; i++) {
            this.playerGruntz[i].isSelected = true;
          }
          break;
        }
      }
    });
  }

  // selectGruntzWithDrag(): void {}

  // selectGruntzWithClick(): void {}

  // TODO: Implement
  /**
   * Populates the GridEngine config with the characters specified
   * on the current Tilemap. Characters are then given a Position,
   * Tool, Toy or other attributes according to their data, and
   * placed on the map.
   */
  setCharacterPositions(): void {
    // Clear positions so that updated positions
    // don't get appended to, but replace the obsolete ones
    // characterPositions.length = 0;
  }
}
