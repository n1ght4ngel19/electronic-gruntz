import Phaser from 'phaser';
import {GridEngine} from 'grid-engine';
import Tilemap = Phaser.Tilemaps.Tilemap;
import {Grunt} from './gruntz/Grunt';
import {ControlKeys} from './ControlKeys';
import Vector2 = Phaser.Math.Vector2;
import {HandlerManager} from './managers/HandlerManager';
import {CreatorManager} from './managers/CreatorManager';
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;

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

  handlerManager = new HandlerManager(this);
  creatorManager = new CreatorManager(this);

  controlKeys = new ControlKeys(this);

  gridEngine!: GridEngine;
  gridEngineConfig = {
    characters: [],
    numberOfDirections: 8,
  };

  map!: Tilemap;
  mapWidth!: number;
  mapHeight!: number;

  baseLayer!: TilemapLayer;
  hiddenLayer!: TilemapLayer;
  actionLayer!: TilemapLayer;
  itemLayer!: TilemapLayer;
  mapObjects!: Phaser.GameObjects.GameObject[];

  playerGruntz: Grunt[] = [];
  playerGruntPositions: Vector2[] = [];

  nextGruntIdNumber = 1;


  /**
   * Preload
   */
  preload(): void {
    this.load.scenePlugin('AnimatedTiles', 'https://tinyurl.com/yckrhe6a', 'animatedTiles', 'animatedTiles');

    this.handlerManager.assetHandler.loadMapAndTilesets(mapName, tilesetName);
    this.handlerManager.assetHandler.loadAnimationAtlases();
  }


  /**
   * Create
   */
  create(): void {
    this.controlKeys.createAllKeys();

    const gruntAnimationAtlases = this.creatorManager.animationCreator.createAllAnimationAtlases();
    this.creatorManager.animationCreator.createAllAtlasAnimations(gruntAnimationAtlases);
    this.creatorManager.animationCreator.createPickupAnimations();

    this.map = this.handlerManager.assetHandler.makeMapWithLayers(mapName, tilesetName);
    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;

    // @ts-ignore
    this.animatedTiles.init(this.map);

    // TODO: Find a better/more elegant solution?
    // Making all ObjectLayer objects invisible
    for (const object of this.mapObjects) {
      // @ts-ignore
      object.visible = false;
    }

    this.creatorManager.gruntCreator.createAllGruntz(gruntAnimationAtlases);

    // Make all gruntz play their default idle animations
    for (const grunt of this.playerGruntz) {
      grunt.anims.play(`${grunt.gruntType}SouthIdle`);
    }

    this.creatorManager.gruntCreator.addAllGruntzToGridEngineConfig();

    this.gridEngine.create(this.map, this.gridEngineConfig);

    this.handlerManager.cameraHandler.setDefaultCameraSettings(this.cameras.main, this.mapWidth, this.mapHeight);
    this.handlerManager.cameraHandler.handleZoom(this.cameras.main, this.mapWidth);

    this.handlerManager.pauseMenuHandler.handlePause();

    this.handlerManager.controlHandler.selectGruntzWithKeys();

    console.log(this.map);
    console.log(this.playerGruntz);
  }


  /**
   * Update
   */
  update(): void {
    this.updateGruntPositions();

    this.handlerManager.animationHandler.handleWalkingAnimations(this.playerGruntz);
    this.handlerManager.animationHandler.handleIdleAnimations(this.playerGruntz);

    this.handlerManager.cameraHandler.handleCameraEdgeScroll(this.cameras.main, 15);
    this.handlerManager.cameraHandler.handleCameraKeysScroll(this.cameras.main, 15);

    this.handlerManager.actionHandler.handleMoveCommand(this.playerGruntz);
    this.handlerManager.actionHandler.handleMoveArrows(this.playerGruntz);
    this.handlerManager.actionHandler.handleToolPickup(this.playerGruntz, this.playerGruntPositions);
  }

  updateGruntPositions(): void {
    this.playerGruntPositions = [];

    // Get the position of all player Gruntz currently on the map
    for (const [index, grunt] of this.playerGruntz.entries()) {
      this.playerGruntPositions[index] = new Vector2(
          Math.round(grunt.x / 32),
          Math.round(grunt.y / 32),
      );
    }
  }
}
