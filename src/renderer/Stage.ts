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
import {Switch} from './Switch';
import {Pyramid} from './Pyramid';
import {Bridge} from './Bridge';

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

  baseLayer!: TilemapLayer;
  secretLayer!: TilemapLayer;
  actionLayer!: TilemapLayer;
  itemLayer!: TilemapLayer;
  mapObjects!: Phaser.GameObjects.GameObject[];

  // SecretSwitch helper variables
  secretObjects: Phaser.GameObjects.GameObject[] = [];
  secretObjectPositions: Vector2[] = [];
  secretSwitchPosition!: Vector2;
  secretSwitch!: Switch;

  checkPointSwitchProperties: {position: Vector2, requirement: GruntType, isUntouched: boolean}[] = [];
  checkPointPyramidGroups: Pyramid[][] = [];

  blueToggleSwitches: Switch[] = [];
  blueToggleSwitchProperties: {position: Vector2, isUntouched: boolean, isUp: boolean}[] = [];
  blueToggleSwitchBridgeGroups: Bridge[][] = [];

  playerGruntz: Grunt[] = [];

  nextGruntIdNumber = 1;

  /**
   * Preload
   */
  preload(): void {
    this.input.setDefaultCursor('url(cursors/CursorPointer_48.png), pointer');

    this.load.scenePlugin('AnimatedTiles', 'https://tinyurl.com/yckrhe6a', 'animatedTiles', 'animatedTiles');

    this.handlerManager.assetHandler.loadMapAndTilesets(mapName, tilesetName);
    this.handlerManager.assetHandler.loadAnimationAtlases();
    this.handlerManager.assetHandler.loadTileAnimationAtlases();
  }


  /**
   * Create
   */
  create(): void {
    this.controlKeys.createAllKeys();

    const gruntAnimationAtlases = this.creatorManager.animationCreator.createAllAnimationAtlases();
    this.creatorManager.animationCreator.createAllAtlasAnimations(gruntAnimationAtlases);

    const tileAnimationAtlases = this.creatorManager.animationCreator.createAllTileAnimationAtlases();
    this.creatorManager.animationCreator.createAllTileAtlasAnimations(tileAnimationAtlases);

    this.map = this.handlerManager.assetHandler.makeMapWithLayers(mapName, tilesetName);

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

    this.gridEngine.create(
        this.map,
        this.gridEngineConfig);

    this.handlerManager.cameraHandler.setDefaultCameraSettings(
        this.cameras.main,
        this.map.widthInPixels,
        this.map.heightInPixels);

    this.handlerManager.cameraHandler.handleZoom(
        this.cameras.main,
        this.map.widthInPixels);

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
          this.secretSwitch = this.add.existing(
              new Switch(
                  this,
                  object.x,
                  object.y,
                  'switchAnimationz',
                  'SwitchSecret_01'),
          );

          // Collecting objects related to the SecretSwitch based on its linked map objects
          for (const id of Object.values(object.data.list)) {
            for (const [index, object] of this.map.getObjectLayer('mapObjects').objects.entries()) {
              if (object.id === id) {
                // @ts-ignore
                this.secretObjectPositions.push(new Vector2(this.mapObjects[index].coordX, this.mapObjects[index].coordY));
                this.secretObjects.push(this.mapObjects[index]);
              }
            }
          }
          break;
        case /CheckPoint_\d+_Switch/.test(object.name):
          console.log('Found a CheckPointSwitch!');
          const checkPointPyramids: Pyramid[] = [];

          for (const value of Object.values(object.data.list)) {
            for (const [index, mapObject] of this.map.getObjectLayer('mapObjects').objects.entries()) {
              if (mapObject.id === value) {
                checkPointPyramids.push(this.add.existing(
                    new Pyramid(
                        this,
                        this.mapObjects[index].x,
                        this.mapObjects[index].y,
                        'pyramidAnimationz',
                        'PyramidCheckPoint_01')),
                );
              }
            }

            if (Object.values(GruntType).includes(value)) {
              // @ts-ignore
              const pos = new Vector2(object.coordX, object.coordY);
              const req = <GruntType>value;

              this.checkPointSwitchProperties.push({
                position: pos,
                requirement: req,
                isUntouched: true,
              });
            }
          }
          this.checkPointPyramidGroups.push(checkPointPyramids);

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
          const blueToggleSwitchBridges: Bridge[] = [];

          this.blueToggleSwitches.push(this.add.existing(
              new Switch(
                  this,
                  object.x,
                  object.y,
                  'switchAnimationz',
                  'SwitchBlueToggle_01'),
          ));

          for (const value of Object.values(object.data.list)) {
            for (const [index, mapObject] of this.map.getObjectLayer('mapObjects').objects.entries()) {
              if (mapObject.id === value) {
                blueToggleSwitchBridges.push(this.add.existing(
                    new Bridge(
                        this,
                        this.mapObjects[index].x,
                        this.mapObjects[index].y,
                        'rockyRoadzBridgez',
                        'WaterBridge_05')),
                );
              }
            }
          }
          // @ts-ignore
          const pos = new Vector2(object.coordX, object.coordY);

          this.blueToggleSwitchProperties.push({position: pos, isUntouched: true, isUp: true});
          this.blueToggleSwitchBridgeGroups.push(blueToggleSwitchBridges);
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
    this.handlerManager.actionHandler.handleToolPickup(this.playerGruntz);

    this.handlerManager.actionHandler.handleSecretSwitch();
    this.handlerManager.actionHandler.handleCheckPointSwitches();
    this.handlerManager.actionHandler.handleBlueToggleSwitches();
  }

  updateGruntPositions(): void {
    for (const grunt of this.playerGruntz) {
      grunt.coords.x = Math.round(grunt.x / 32);
      grunt.coords.y = Math.round(grunt.y / 32);
    }
  }
}
