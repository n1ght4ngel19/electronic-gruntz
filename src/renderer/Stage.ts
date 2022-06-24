import Phaser from 'phaser';
import {GridEngine, Position} from 'grid-engine';
import Tilemap = Phaser.Tilemaps.Tilemap;
import Tile = Phaser.Tilemaps.Tile;
import Key = Phaser.Input.Keyboard.Key;
import {AnimationCreator} from './presentationHandlers/AnimationCreator';
import {AnimationHandler} from './presentationHandlers/AnimationHandler';
import {CameraHandler} from './actionHandlers/CameraHandler';
import {GruntType} from './gruntz/GruntType';
import {PauseMenuHandler} from './PauseMenuHandler';
import {MovementHandler} from './actionHandlers/MovementHandler';

const searchParams = new URLSearchParams(window.location.search);
const mapName = String(searchParams.get('stage'));

export class Stage extends Phaser.Scene {
  /**
   * Constructor
   */
  constructor() {
    super({key: 'stage'});
  }

  cameraHandler = new CameraHandler(this);
  animationHandler = new AnimationHandler(this);
  animationCreator = new AnimationCreator(this);
  pauseMenuHandler = new PauseMenuHandler(this);
  movementHandler = new MovementHandler(this);

  gridEngine!: GridEngine;

  upArrowKey!: Key;
  downArrowKey!: Key;
  leftArrowKey!: Key;
  rightArrowKey!: Key;

  wButtonKey!: Key;
  aButtonKey!: Key;
  sButtonKey!: Key;
  dButtonKey!: Key;


  /**
   * Preload
   */
  preload(): void {
    this.loadMapParts();

    this.load.atlasXML('NORMALGRUNT', 'animations/ANIMS/NORMALGRUNT.png', 'animations/ANIMS/NORMALGRUNT.xml');
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

    const map = this.makeMapWithLayers();
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    const playerSprite = this.add.sprite(0, 0, normalGruntAtlas);
    // playerSprite.scale = 1.5;
    playerSprite.anims.play('normalGruntSouthIdle');

    const gridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          startPosition: {x: 2, y: 18},
          speed: 4,
          // speed: Math.floor(10/6),
        },
      ],
      numberOfDirections: 8,
    };

    this.gridEngine.create(map, gridEngineConfig);

    this.animationHandler.handleIdlingAnimations(playerSprite, GruntType.normalGrunt);
    this.animationHandler.handleWalkingAnimations(playerSprite, GruntType.normalGrunt);

    this.cameraHandler.setDefaultCameraSettings(this.cameras.main, mapWidth, mapHeight);
    this.cameraHandler.handleZoom(this.cameras.main, mapWidth);

    this.pauseMenuHandler.handlePause();
  }


  /**
   * Update
   */
  update(): void {
    this.cameraHandler.handleCameraEdgeScroll(this.cameras.main, 15);
    this.cameraHandler.handleCameraKeysScroll(this.cameras.main, 15);

    this.movementHandler.handleMovement();
  }


  // TODO: Implement
  /**
   * Handles commands given by the player to their active Grunt/Gruntz.
   */
  handleCommand(): void {

  }

  // TODO: Implement
  /**
   * Handles the logic involving the arrows that force Gruntz to move
   * in a specific direction.
   *
   * @param {Tile[]} data - The data of the layer that contains the arrows
   */
  handleMoveArrows(data: Tile[][]): void {

  }

  // TODO: Implement
  /**
   * Handles the logic involving the rocks the player may encounter.
   * Visually these can be diverse, like rocks, cakes, dice, etc.
   *
   * @param {Tile[]} data - The data of the layer containing the rocks
   */
  handleRocks(data: Tile[][]): void {

  }

  // TODO: Implement
  /**
   * Handles the logic involving the buildable/breakable
   * bricks the player may encounter.
   *
   * @param {Tile[]} data - The data of the layer containing the bricks
   */
  handleBricks(data: Tile[][]): void {
    console.log(data);
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

  /**
   * Checks if the target position is adjacent to the character
   * specified by charId.
   *
   * @param {string} charId - The id of the checked character in GridEngine
   * @param {Position} target - The target position
   *
   * @return {boolean} - True if the target is adjacent to the character,
   * false otherwise
   */
  isAdjacentToTarget(charId: string, target: Position): boolean {
    const charPosition = this.gridEngine.getPosition(charId);
    const dx = Math.abs(charPosition.x - target.x);
    const dy = Math.abs(charPosition.y - target.y);

    if (dx <= 1 && dy <= 1) {
      return (dx + dy === 1 || dx + dy === 2);
    } else {
      return false;
    }
  }

  /**
   * Creates the map and populates it with the different layers
   * used for the game logic.
   *
   * @return {Tilemap} - The map that is to be used in the game
   */
  makeMapWithLayers(): Tilemap {
    const newMap = this.make.tilemap({key: mapName});

    // Add tileset images
    const tilesetSwitchMarkers = newMap.addTilesetImage('TilesetSwitchMarkers', 'tilesetSwitchMarkers');
    const tilesetBase = newMap.addTilesetImage('NewSet', 'tilesetRockyRoadz', 32, 32, 1, 2);
    const tilesetGeneral = newMap.addTilesetImage('TilesetGeneral', 'tilesetGeneral');

    // Create layers
    newMap.createLayer('Switch Markers', tilesetSwitchMarkers);
    newMap.createLayer('Base', tilesetBase);
    newMap.createLayer('Manipulables', tilesetGeneral);

    return newMap;
  }

  /**
   * Loads the JSON file the map is based on, and also the tileset images
   * used by the map.
   */
  loadMapParts(): void {
    this.load.tilemapTiledJSON(mapName, `maps/${mapName}.json`);
    this.load.image('tilesetRockyRoadz', 'tilesets/NewSet.png');
    this.load.image('tilesetGeneral', 'tilesets/TilesetGeneral.png');
    this.load.image('tilesetSwitchMarkers', 'tilesets/TilesetSwitchMarkers.png');
  }

  // TODO: Implement
  /**
   * Handles the logic of an interaction between a character and an
   * interactive object, such as a rock, brick, hole, etc.
   *
   * @param {string} charId the id of the character in GridEngine that is involved in the interaction
   * @param {Tile} target the targeted interactive object
   */
  interact(charId: string, target: Tile): void {
  }
}
