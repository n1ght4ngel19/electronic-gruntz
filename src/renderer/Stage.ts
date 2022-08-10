import Phaser from 'phaser';
import {GridEngine} from 'grid-engine';
import {Grunt} from './gruntz/Grunt';
import {ControlKeys} from './ControlKeys';
import {HandlerManager} from './managers/HandlerManager';
import {CreatorManager} from './managers/CreatorManager';
import Tilemap = Phaser.Tilemaps.Tilemap;
import Vector2 = Phaser.Math.Vector2;
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
  secretLayerHidden!: TilemapLayer;
  actionLayer!: TilemapLayer;
  secretLayerTop!: TilemapLayer;
  itemLayer!: TilemapLayer;
  mapObjects!: Phaser.GameObjects.GameObject[];

  secretObjects: Phaser.GameObjects.GameObject[] = [];
  secretObjectPositions: Vector2[] = [];
  secretSwitchState: boolean = true;
  secretSwitchPosition!: Vector2;

  playerGruntz: Grunt[] = [];
  playerGruntPositions: Vector2[] = [];

  nextGruntIdNumber = 1;

  // blueSwitchPosition: Vector2;
  // bridgepositions: Vector2[] = [];
  // cpswitchPosition: Vector2;
  // cpPyramids: Vector2[] = [];


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

    this.mapObjects.forEach((object) => {
      object.coordX = Math.floor(object.x / 32);
      object.coordY = Math.floor(object.y / 32);

      const position = new Vector2(object.coordX, object.coordY);

      switch (object.name) {
        case 'SecretSwitch':
          this.secretSwitchPosition = position;
          break;
        // case 'FirstBridgeSwitch':
        //   this.blueSwitchPosition = position;
        //   break;
        // case 'FirstBridge':
        //   this.bridgepositions.push(position);
        //   break;
        // case 'FirstCheckpointSwitch':
        //   this.cpswitchPosition = position;
        //   break;
        // case 'FirstCheckpointPyramid':
        //   this.cpPyramids.push(position);
        //   break;
        default:
          break;
      }
    });

    // Collect all secret object positions
    for (const object of this.mapObjects) {
      if (object.name.includes('Secret_')) {
        this.secretObjectPositions.push(new Vector2(object.coordX, object.coordY));
        this.secretObjects.push(object);
      }
    }

    // TODO: Remove?
    // Collect all grunt positions
    // for (const [index, grunt] of this.playerGruntz.entries()) {
    //   this.playerGruntPositions[index] = new Vector2(
    //       Math.floor(grunt.x / 32),
    //       Math.floor(grunt.y / 32),
    //   );
    // }

    this.secretLayerHidden.setVisible(false);
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
    this.handlerManager.actionHandler.handleSecretSwitch();
  }

  updateGruntPositions(): void {
    this.playerGruntPositions = [];

    for (const [index, grunt] of this.playerGruntz.entries()) {
      this.playerGruntPositions[index] = new Vector2(
          Math.round(grunt.x / 32),
          Math.round(grunt.y / 32),
      );
    }
  }
}
