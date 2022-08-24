import Phaser from 'phaser';
import {GridEngine} from 'grid-engine';
import {Grunt} from './gruntz/Grunt';
import {ControlKeys} from './ControlKeys';
import {HandlerManager} from './managers/HandlerManager';
import {CreatorManager} from './managers/CreatorManager';
import Tilemap = Phaser.Tilemaps.Tilemap;
import Vector2 = Phaser.Math.Vector2;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import {GruntType} from './gruntz/GruntType';

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
  secretLayer!: TilemapLayer;
  actionLayer!: TilemapLayer;
  itemLayer!: TilemapLayer;
  mapObjects!: Phaser.GameObjects.GameObject[];

  // SecretSwitch helper variables
  secretObjects: Phaser.GameObjects.GameObject[] = [];
  secretObjectPositions: Vector2[] = [];
  secretSwitchState: boolean = true;
  secretSwitchPosition!: Vector2;

  checkPointSwitches: {position: Vector2, requirement: GruntType}[] = [];
  checkPointPyramidPositionGroups: Vector2[][] = [];

  blueToggleSwitches: {position: Vector2, state: boolean}[] = [];
  waterBridgePositionGroups: Vector2[][] = [];

  playerGruntz: Grunt[] = [];
  playerGruntPositions: Vector2[] = [];

  nextGruntIdNumber = 1;

  // toggleBridges: Phaser.GameObjects.GameObject[] = [];
  // crumblingBridges: Phaser.GameObjects.GameObject[] = [];

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

    this.mapObjects.forEach((object) => {
      // @ts-ignore
      object.visible = false;
    });

    this.secretLayer.forEachTile((tile) => {
      tile.setVisible(false);
    });

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

    this.handlerManager.controlHandler.handleSelection();

    this.mapObjects.forEach((object) => {
      // @ts-ignore
      object.coordX = Math.floor(object.x / 32);
      // @ts-ignore
      object.coordY = Math.floor(object.y / 32);

      switch (true) {
        case /SecretSwitch/.test(object.name):
          // @ts-ignore
          this.secretSwitchPosition = new Vector2(object.coordX, object.coordY);

          // Collecting objects related to the SecretSwitch based on its linked map objects
          for (const id of Object.values(object.data.list)) {
            for (const [index, mapObject] of this.map.getObjectLayer('mapObjects').objects.entries()) {
              if (mapObject.id === id) {
                // @ts-ignore
                this.secretObjectPositions.push(new Vector2(this.mapObjects[index].coordX, this.mapObjects[index].coordY));
                this.secretObjects.push(this.mapObjects[index]);
              }
            }
          }
          break;
        case /CheckPoint_\d+_Switch/.test(object.name):
          console.log('Found a CheckPointSwitch!');
          // @ts-ignore
          const checkPointPyramids: Vector2[] = [];

          for (const value of Object.values(object.data.list)) {
            for (const [index, mapObject] of this.map.getObjectLayer('mapObjects').objects.entries()) {
              if (mapObject.id === value) {
                // @ts-ignore
                checkPointPyramids.push(new Vector2(this.mapObjects[index].coordX, this.mapObjects[index].coordY));
              }
            }

            if (Object.values(GruntType).includes(value)) {
              // @ts-ignore
              const pos = new Vector2(object.coordX, object.coordY);
              const req = <GruntType>value;

              this.checkPointSwitches.push({position: pos, requirement: req});
            }
          }
          this.checkPointPyramidPositionGroups.push(checkPointPyramids);

          /**
           * TODO: Solve multiple CheckPoint Switches by targeting other Switches to only one, which is connected to the Pyramids
           * So, if the only target is a CheckPoint Switch, do the thing, if it's Pyramids, do the other thing
           */

          /**
           * TODO: Requirement from Stage 2 onwards
           * Check for arbitrary number of interconnected Switches
           * Sort Switch target Pyramids so that their order doesn't matter (which shouldn't)
           * Check array equality for all target arrays and group identical arrays
           * The Switches with the same targets are that open a CheckPoint together
           */

          break;
        case /BlueToggleSwitch_\d+/.test(object.name):
          console.log('Found a BlueToggleSwitch!');
          // @ts-ignore
          const waterBridges: Vector2[] = [];
          for (const value of Object.values(object.data.list)) {
            for (const [index, mapObject] of this.map.getObjectLayer('mapObjects').objects.entries()) {
              if (mapObject.id === value) {
                // @ts-ignore
                waterBridges.push(new Vector2(this.mapObjects[index].coordX, this.mapObjects[index].coordY));
              }
            }
          }
          // @ts-ignore
          const pos = new Vector2(object.coordX, object.coordY);

          // @ts-ignore
          this.blueToggleSwitches.push({position: pos, state: false});
          this.waterBridgePositionGroups.push(waterBridges);
          break;
        default:
          break;
      }
    });
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
    this.handlerManager.actionHandler.handleCheckPointSwitches();
    this.handlerManager.actionHandler.handleBlueToggleSwitches();
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
