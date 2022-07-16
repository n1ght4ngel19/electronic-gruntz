import Phaser from 'phaser';
import {GridEngine} from 'grid-engine';
import Tilemap = Phaser.Tilemaps.Tilemap;
import {Grunt} from './gruntz/Grunt';
import Tileset = Phaser.Tilemaps.Tileset;
import {ControlKeys} from './ControlKeys';
import Vector2 = Phaser.Math.Vector2;
import {HandlerManager} from './managers/HandlerManager';
import {CreatorManager} from './managers/CreatorManager';

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

  baseLayer!: Tileset;
  generalLayer!: Tileset;
  brickLayer!: Tileset;
  animatedLayer!: Tileset;
  toolzLayer!: Tileset;
  markerLayer!: Tileset;
  // switchLayer!: Tileset;

  playerGruntz: Grunt[] = [];
  playerGruntzPositionz: Vector2[] = [];

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

    // TODO: Move into GruntCreator
    for (let i = 0; i < this.map.getLayer('markerLayer').width; i++) {
      for (let j = 0; j < this.map.getLayer('markerLayer').height; j++) {
        const gruntTypeToAdd = this.map.getTileAt(i, j, true, 'markerLayer').properties.gruntType;

        if (gruntTypeToAdd) {
          switch (gruntTypeToAdd) {
            case 'normalGrunt': {
              this.playerGruntz.push(
                  this.add.existing(
                      new Grunt(this, 0, 0, gruntAnimationAtlases[0], false, `grunt${this.nextGruntIdNumber++}`, gruntTypeToAdd),
                  ),
              );
              break;
            }
            case 'clubGrunt': {
              this.playerGruntz.push(
                  this.add.existing(
                      new Grunt(this, 0, 0, gruntAnimationAtlases[1], false, `grunt${this.nextGruntIdNumber++}`, gruntTypeToAdd),
                  ),
              );
              break;
            }
            case 'gauntletzGrunt': {
              this.playerGruntz.push(
                  this.add.existing(
                      new Grunt(this, 0, 0, gruntAnimationAtlases[1], false, `grunt${this.nextGruntIdNumber++}`, gruntTypeToAdd),
                  ),
              );
              break;
            }
            default: {
              throw new Error('Invalid GruntType!');
            }
          }

          this.playerGruntzPositionz.push(new Vector2(i, j));
        }
      }
    }

    for (let i = 0; i < this.playerGruntz.length; i++) {
      this.playerGruntz[i].anims.play(`${this.playerGruntz[i].gruntType}SouthIdle`);
    }

    this.creatorManager.gruntCreator.createAllGridEngineGruntz();

    this.gridEngine.create(this.map, this.gridEngineConfig);

    this.handlerManager.cameraHandler.setDefaultCameraSettings(this.cameras.main, this.mapWidth, this.mapHeight);
    this.handlerManager.cameraHandler.handleZoom(this.cameras.main, this.mapWidth);

    this.handlerManager.pauseMenuHandler.handlePause();

    this.selectGruntzWithKeys();

    // Logging where the toolz on the map at
    for (let i = 0; i < this.map.width; i++) {
      for (let j = 0; j < this.map.height; j++) {
        if (this.map.getTileAt(i, j, true, 'toolzLayer').properties.toolType) {
          this.map.getTileAt(i, j, true, 'toolzLayer');
          console.log(this.map.getTileAt(i, j, true, 'toolzLayer').properties.toolType);
          console.log('i: ', i);
          console.log('j: ', j);
        }
      }
    }
  }


  /**
   * Update
   */
  update(): void {
    this.playerGruntzPositionz = [];

    // Get the position of all player Gruntz currently on the map
    for (let i = 0; i < this.playerGruntz.length; i++) {
      this.playerGruntzPositionz[i] = new Vector2(Math.round(this.playerGruntz[i].x / 32), Math.round(this.playerGruntz[i].y / 32));
    }

    this.handlerManager.animationHandler.handleWalkingAnimations(this.playerGruntz);
    this.handlerManager.animationHandler.handleIdleAnimations(this.playerGruntz);

    this.handlerManager.cameraHandler.handleCameraEdgeScroll(this.cameras.main, 15);
    this.handlerManager.cameraHandler.handleCameraKeysScroll(this.cameras.main, 15);

    this.handlerManager.actionHandler.handleMoveCommand(this.playerGruntz);
    this.handlerManager.actionHandler.handleMoveArrows(this.playerGruntz);
    this.handlerManager.actionHandler.handleToolPickup();
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
}
