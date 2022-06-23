import Phaser from 'phaser';
import {GridEngine, Position} from 'grid-engine';
import Camera = Phaser.Cameras.Scene2D.Camera;
import Tilemap = Phaser.Tilemaps.Tilemap;
import Tile = Phaser.Tilemaps.Tile;
import Texture = Phaser.Textures.Texture;
import Key = Phaser.Input.Keyboard.Key;

const searchParams = new URLSearchParams(window.location.search);
const mapName = String(searchParams.get('stage'));

/**
 * TODO
 */
export class Stage extends Phaser.Scene {
  /**
   * Constructor
   */
  constructor() {
    super({key: 'stage'});
  }

  gridEngine!: GridEngine;

  upKey!: Key;
  downKey!: Key;
  leftKey!: Key;
  rightKey!: Key;


  preload(): void {
    this.loadMapParts();

    this.load.atlasXML('NORMALGRUNT', 'animations/ANIMS/NORMALGRUNT.png', 'animations/ANIMS/NORMALGRUNT.xml');
  }


  create(): void {
    const mainCam = this.cameras.main;
    const pointer = this.input.activePointer;

    const cursors = this.input.keyboard;
    cursors.createCursorKeys();
    cursors.addKeys('UP, DOWN, LEFT, RIGHT');

    this.upKey = this.input.keyboard.addKey('UP');
    this.downKey = this.input.keyboard.addKey('DOWN');
    this.leftKey = this.input.keyboard.addKey('LEFT');
    this.rightKey = this.input.keyboard.addKey('RIGHT');

    const normalGruntAtlas = this.textures.get('NORMALGRUNT');
    this.createAtlasAnimations('NORMALGRUNT');

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

    this.gridEngine.movementStarted().subscribe(({charId, direction}) => {
      switch (direction) {
        case 'up':
          playerSprite.anims.play('normalGruntNorthWalk');
          break;
        case 'up-right':
          playerSprite.anims.play('normalGruntNorthEastWalk');
          break;
        case 'right':
          playerSprite.anims.play('normalGruntEastWalk');
          break;
        case 'down-right':
          playerSprite.anims.play('normalGruntSouthEastWalk');
          break;
        case 'down':
          playerSprite.anims.play('normalGruntSouthWalk');
          break;
        case 'down-left':
          playerSprite.anims.play('normalGruntSouthWestWalk');
          break;
        case 'left':
          playerSprite.anims.play('normalGruntWestWalk');
          break;
        case 'up-left':
          playerSprite.anims.play('normalGruntNorthWestWalk');
          break;
        default:
          throw new Error('Invalid animation.');
      }
    });

    this.gridEngine.movementStopped().subscribe(({charId, direction}) => {
      switch (direction) {
        case 'up':
          playerSprite.anims.play('normalGruntNorthIdle');
          break;
        case 'up-right':
          playerSprite.anims.play('normalGruntNorthEastIdle');
          break;
        case 'right':
          playerSprite.anims.play('normalGruntEastIdle');
          break;
        case 'down-right':
          playerSprite.anims.play('normalGruntSouthEastIdle');
          break;
        case 'down':
          playerSprite.anims.play('normalGruntSouthIdle');
          break;
        case 'down-left':
          playerSprite.anims.play('normalGruntSouthWestIdle');
          break;
        case 'left':
          playerSprite.anims.play('normalGruntWestIdle');
          break;
        case 'up-left':
          playerSprite.anims.play('normalGruntNorthWestIdle');
          break;
        default:
          throw new Error('Invalid animation.');
      }
    });

    mainCam.setBounds(0, 0, mapWidth, mapHeight);
    mainCam.zoom = 1.75;

    this.handleZoom(mainCam, mapWidth);
    this.handlePause();
  }


  update(): void {
    this.handleCameraEdgeScroll(this.cameras.main, 15);
    this.handleCameraKeysScroll(this.cameras.main, 15);

    // Using worldX and worldY because this way we get
    // the correct pointer positions even when zoomed in/out
    const pointerX = Math.floor(this.input.activePointer.worldX/32);
    const pointerY = Math.floor(this.input.activePointer.worldY/32);
    const pointerPosition = {x: pointerX, y: pointerY};

    if (this.input.activePointer.isDown) {
      this.gridEngine.moveTo('player', pointerPosition);
    }
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
   * @param {Tile[][]} data - The data of the layer that contains the arrows
   */
  handleMoveArrows(data: Tile[][]): void {

  }

  // TODO: Implement
  /**
   * Handles the logic involving the rocks the player may encounter.
   * Visually these can be diverse, like rocks, cakes, dice, etc.
   *
   * @param {Tile[][]} data - The data of the layer containing the rocks
   */
  handleRocks(data: Tile[][]): void {

  }

  // TODO: Implement
  /**
   * Handles the logic involving the buildable/breakable
   * bricks the player may encounter.
   *
   * @param {Tile[][]} data - The data of the layer containing the bricks
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

  /**
   * Creates an animation from the texture atlas identified by the atlasKey parameter.
   *
   * @param {string} atlasKey - The key of the texture atlas as specified when loaded
   * inside the preload method
   * @param {string} animKey - The key by which the animation should be referred
   * to hereafter
   * @param {string} animPrefix - The prefix of the animation as found inside the
   * descriptor file of the texture atlas
   */
  createAtlasAnimation(atlasKey: string, animKey: string, animPrefix: string) {
    this.anims.create({
      key: animKey,
      repeat: -1,
      frameRate: 10,
      frames: this.anims.generateFrameNames(atlasKey, {
        prefix: animPrefix,
        start: 1,
        end: this.findFrameCount(this.textures.get(atlasKey), animPrefix),
        zeroPad: 2,
      }),
    });
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

  /**
   * Creates all the animations from the texture atlas identified by the atlasKey parameter.
   *
   * @param {string} atlasKey - The key of the texture atlas we are creating the animations from
   */
  createAtlasAnimations(atlasKey: string): void {
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthAttack', 'NORTH_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastAttack', 'NORTHEAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastAttack', 'EAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastAttack', 'SOUTHEAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthAttack', 'SOUTH_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestAttack', 'SOUTHWEST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestAttack', 'WEST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestAttack', 'NORTHWEST_ATTACK_');

    this.createAtlasAnimation(atlasKey, 'normalGruntNorthIdle', 'NORTH_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastIdle', 'NORTHEAST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastIdle', 'EAST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastIdle', 'SOUTHEAST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthIdle', 'SOUTH_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestIdle', 'SOUTHWEST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestIdle', 'WEST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestIdle', 'NORTHWEST_IDLE_');

    // this.createAtlasAnimation(atlasKey, 'normalGruntNorthItem', 'NORMALGRUNT_NORTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastItem', 'NORMALGRUNT_NORTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntEastItem', 'NORMALGRUNT_EAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastItem', 'NORMALGRUNT_SOUTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntSouthItem', 'NORMALGRUNT_SOUTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestItem', 'NORMALGRUNT_SOUTHWEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntWestItem', 'NORMALGRUNT_WEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestItem', 'NORMALGRUNT_NORTHWEST_ITEM_');

    this.createAtlasAnimation(atlasKey, 'normalGruntNorthStruck', 'NORTH_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastStruck', 'NORTHEAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastStruck', 'EAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastStruck', 'SOUTHEAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthStruck', 'SOUTH_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestStruck', 'SOUTHWEST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestStruck', 'WEST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestStruck', 'NORTHWEST_STRUCK_');

    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWalk', 'NORTH_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastWalk', 'NORTHEAST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastWalk', 'EAST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastWalk', 'SOUTHEAST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWalk', 'SOUTH_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestWalk', 'SOUTHWEST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestWalk', 'WEST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestWalk', 'NORTHWEST_WALK_');
  }

  /**
   * Counts the number of animations inside the texture atlas
   * specified by the atlas parameter, later to be used for
   * determining how many frames an animation has.
   *
   * @param {Texture} atlas - The texture atlas we are searching in
   * @param {string} animPrefix - The prefix of the animation we are interested in counting
   *
   * @return {number} - The number of animations found
   */
  findFrameCount(atlas: Texture, animPrefix: string): number {
    let count = 0;

    atlas.getFrameNames().forEach((frameName) => {
      if (frameName.startsWith(animPrefix)) {
        count++;
      }
    });

    return count;
  }

  /**
   * Handles zooming capabilities.
   *
   * @param {Camera} mainCam - The main camera of the scene
   * @param {number} mapWidth - The width of the tilemap in pixels
   */
  handleZoom(mainCam: Camera, mapWidth: number): void {
    const maxZoom = 2.5;
    const zoomIncrement = 0.125;

    this.input.on('wheel', (pointer: any, GameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
      if ((mainCam.zoom < maxZoom) && (mainCam.displayWidth < mapWidth)) {
        this.handleZoomOut(mainCam, deltaY, zoomIncrement);
        this.handleZoomIn(mainCam, deltaY, zoomIncrement);
      } else if (mainCam.zoom === maxZoom) {
        this.handleZoomOut(mainCam, deltaY, zoomIncrement);
      } else if (mainCam.displayWidth === mapWidth) {
        this.handleZoomIn(mainCam, deltaY, zoomIncrement);
      }
    });
  }

  /**
   * Handles zooming in.
   *
   * @param {Camera} mainCam - The main camera of the scene
   * @param {number} deltaY - The movement of the scroll wheel
   * @param {number} zoomIncrement - The amount of zoom to be applied with each scroll
   */
  handleZoomIn(mainCam: Camera, deltaY: number, zoomIncrement: number): void {
    if (deltaY < 0) {
      mainCam.zoom += zoomIncrement;
    }
  }

  /**
   * Handles zooming out.
   *
   * @param {Camera} mainCam - The main camera of the scene
   * @param {number} deltaY - The movement of the scroll wheel
   * @param {number} zoomIncrement - The amount of zoom to be applied with each scroll
   */
  handleZoomOut(mainCam: Camera, deltaY: number, zoomIncrement: number): void {
    if (deltaY > 0) {
      mainCam.zoom -= zoomIncrement;
    }
  }

  /**
   * Handles the camera scrolling when the pointer reaches
   * one of the edges of the screen.
   *
   * @param {Camera} mainCam - The main camera of the scene
   * @param {number} scrollSpeed - The speed at which the camera should move when scrolling
   */
  handleCameraEdgeScroll(mainCam: Camera, scrollSpeed: number): void {
    if (this.input.activePointer.x >= this.game.canvas.width - 50) {
      mainCam.scrollX += scrollSpeed;
    }
    if (this.input.activePointer.x <= 50) {
      mainCam.scrollX -= scrollSpeed;
    }
    if (this.input.activePointer.y >= this.game.canvas.height - 50) {
      mainCam.scrollY += scrollSpeed;
    }
    if (this.input.activePointer.y <= 50) {
      mainCam.scrollY -= scrollSpeed;
    }
  }

  /**
   * Handles the camera scrolling when the pointer reaches
   * one of the edges of the screen.
   *
   * @param {Camera} mainCam - The main camera of the scene
   * @param {number} scrollSpeed - The speed at which the camera should move when scrolling
   */
  handleCameraKeysScroll(mainCam: Camera, scrollSpeed: number): void {
    if (this.upKey.isDown) {
      this.cameras.main.scrollY -= 15;
    }
    if (this.downKey.isDown) {
      this.cameras.main.scrollY += 15;
    }
    if (this.leftKey.isDown) {
      this.cameras.main.scrollX -= 15;
    }
    if (this.rightKey.isDown) {
      this.cameras.main.scrollX += 15;
    }
  }

  /**
   * Handles the presentation of the in-game pause menu
   * and the actions associated with it, e.g. resuming,
   * saving, or quitting the game.
   */
  handlePause(): void {
    this.input.keyboard.on('keydown-ESC', () => {
      // @ts-ignore
      document.getElementById('menu').style.display = 'block';
      this.scene.pause('stage');
    });

    // Navigation with the pointer
    document.addEventListener('click', (event) => {
      // @ts-ignore
      switch (event.target.id) {
        case 'resume': {
          // @ts-ignore
          document.getElementById('menu').style.display = 'none';
          this.scene.resume('stage');
          break;
        }
        case 'save': {
          console.log('Saving...');
          break;
        }
        case 'load': {
          console.log('Loading...');
          break;
        }
        case 'help': {
          console.log('Help...');
          break;
        }
        case 'quit': {
          window.location.href = './questz.html';
          break;
        }
        default: {
          break;
        }
      }
    });

    // Navigation with the arrow keys
    document.onkeydown = (event) => {
      if (event.code === 'ArrowDown') {
        // @ts-ignore
        if (document.getElementsByClassName('active')[0].nextElementSibling == null) {
          document.getElementsByClassName('active')[0].classList.remove('active');
          document.getElementsByClassName('menu-option')[0].classList.add('active');
        } else {
          // @ts-ignore
          document.getElementsByClassName('active')[0].nextElementSibling.classList.add('active');
          document.getElementsByClassName('active')[0].classList.remove('active');
        }
      } else if (event.code === 'ArrowUp') {
        // @ts-ignore
        if (document.getElementsByClassName('active')[0].previousElementSibling == null) {
          document.getElementsByClassName('active')[0].classList.remove('active');
          document.getElementsByClassName('menu-option')[document.getElementsByClassName('menu-option').length - 1].classList.add('active');
        } else {
          // @ts-ignore
          document.getElementsByClassName('active')[0].previousElementSibling.classList.add('active');
          document.getElementsByClassName('active')[1].classList.remove('active');
        }
      } else if (event.code === 'Enter') {
        // @ts-ignore
        document.getElementsByClassName('active')[0].click();
      }
    };

    document.addEventListener('mouseover', (event) => {
      document.getElementsByClassName('active')[0].classList.remove('active');
      // @ts-ignore
      event.target.classList.add('active');
    });
  }
}
