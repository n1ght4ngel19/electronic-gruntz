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

export class Stage extends Phaser.Scene {
  /**
   * Constructor
   */
  constructor() {
    super({key: 'stage'});
  }

  assetLoader = new AssetHandler(this);
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
  aButtonKey!: Key;
  sButtonKey!: Key;
  dButtonKey!: Key;

  player: Grunt;

  map!: Tilemap;
  mapWidth!: number;
  mapHeight!: number;

  baseLayer: Tileset;
  generalLayer: Tileset;
  switchLayer: Tileset;
  brickLayer: Tileset;


  /**
   * Preload
   */
  preload(): void {
    this.assetLoader.loadMapAndTilesets(mapName);
    this.assetLoader.loadAnimationAtlases();
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
    this.aButtonKey = this.input.keyboard.addKey('A');
    this.sButtonKey = this.input.keyboard.addKey('S');
    this.dButtonKey = this.input.keyboard.addKey('D');

    const normalGruntAtlas = this.textures.get('NORMALGRUNT');
    this.animationCreator.createAtlasAnimations(normalGruntAtlas.key);

    this.map = this.assetLoader.makeMapWithLayers(mapName);
    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;

    this.player = this.add.existing(new Grunt(this, 0, 0, normalGruntAtlas));
    // player.scale = 1.5;
    this.player.anims.play('normalGruntSouthIdle');

    const gridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: this.player,
          startPosition: {x: 6, y: 2},
          speed: 4,
          // speed: Math.floor(10/6),
        },
      ],
      numberOfDirections: 8,
    };

    this.gridEngine.create(this.map, gridEngineConfig);

    this.animationHandler.handleIdleAnimations(this.player, GruntType.normalGrunt);
    this.animationHandler.handleWalkingAnimations(this.player, GruntType.normalGrunt);

    this.cameraHandler.setDefaultCameraSettings(this.cameras.main, this.mapWidth, this.mapHeight);
    this.cameraHandler.handleZoom(this.cameras.main, this.mapWidth);

    this.pauseMenuHandler.handlePause();
  }


  /**
   * Update
   */
  update(): void {
    this.cameraHandler.handleCameraEdgeScroll(this.cameras.main, 15);
    this.cameraHandler.handleCameraKeysScroll(this.cameras.main, 15);

    this.commandHandler.handleMovement(this.player, this.player.isActive);
    this.commandHandler.handleMoveArrows(this.player);
  }


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
