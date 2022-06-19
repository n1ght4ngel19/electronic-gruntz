import Phaser from 'phaser';
import {GridEngine, Position} from 'grid-engine';
import Camera = Phaser.Cameras.Scene2D.Camera;
import Tilemap = Phaser.Tilemaps.Tilemap;
import Tile = Phaser.Tilemaps.Tile;
import Pointer = Phaser.Input.Pointer;

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

  map!: Tilemap;

  pointer!: Pointer;

  tileSize!: number;

  // TODO: Populate this dynamically
  characterPositions!: Position[];
  // Will become obsolete after multiple characters
  // ? Layer data

  preload(): void {
    this.loadMapParts();
    // TODO: loadSpritesheets();

    this.load.spritesheet('gruntMovement', 'animations/GruntNormalWalk.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet('gruntIdle', 'animations/GruntNormalIdle.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
  }


  create(): void {
    this.map = this.makeMapWithLayers();

    const cursors = this.input.keyboard;
    cursors.createCursorKeys();
    cursors.addKeys('UP, DOWN, LEFT, RIGHT');

    this.createAnimations();

    // TODO: Add characters dynamically to GridEngine config
    const playerSprite = this.add.sprite(0, 0, 'gruntIdle');
    playerSprite.anims.play('down-idle');

    // TODO: Replace with pause menu functionality
    this.handlePause();

    const gridEngineConfig = {
      // TODO: Add characters dynamically, based on special tiles (SpawnTile, EnemyTile, etc.)
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          startPosition: {x: 2, y: 18},
          speed: 4,
          // speed: Math.floor(10/6)
        },
      ],
      numberOfDirections: 8,
    };

    this.gridEngine.create(this.map, gridEngineConfig);
    this.gridEngine.movementStarted().subscribe(({charId, direction}) => {
      this.gridEngine.getSprite(charId).anims.play(direction);
    });
    this.gridEngine.movementStopped().subscribe(({charId, direction}) => {
      switch (direction) {
        case 'up':
          playerSprite.anims.play('up-idle');
          break;
        case 'up-right':
          playerSprite.anims.play('up-right-idle');
          break;
        case 'right':
          playerSprite.anims.play('right-idle');
          break;
        case 'down-right':
          playerSprite.anims.play('down-right-idle');
          break;
        case 'down':
          playerSprite.anims.play('down-idle');
          break;
        case 'down-left':
          playerSprite.anims.play('down-left-idle');
          break;
        case 'left':
          playerSprite.anims.play('left-idle');
          break;
        case 'up-left':
          playerSprite.anims.play('up-left-idle');
          break;
        default:
          throw new Error('Invalid animation.');
      }
    });

    const mainCam = this.cameras.main;
    mainCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    mainCam.startFollow(this.gridEngine.getSprite('player'));
    mainCam.zoom = 1.75;

    this.handleZoom(mainCam);
    // TODO: Add ability to drag the map
    // this.handleDrag(mainCam);
    // TODO: Add ability to scroll the map
    // this.handleScroll(mainCam);
  }


  update(): void {
    // Using worldX and worldY because this way we get
    // the correct pointer positions even when zoomed in/out
    const pointerX = Math.floor(this.input.activePointer.worldX/32);
    const pointerY = Math.floor(this.input.activePointer.worldY/32);
    const pointerPosition = {x: pointerX, y: pointerY};
    const playerPosition = this.gridEngine.getPosition('player');
    const manipulablesLayerData = this.map.getLayer('Manipulables').data;

    if (this.input.activePointer.isDown) {
      const targetTile = manipulablesLayerData[pointerY][pointerX];

      if (targetTile === undefined) {
        console.log('Cannot move outside the map.');
      } else if (targetTile.properties.interactive) {
        this.gridEngine.moveTo('player', {x: targetTile.x, y: targetTile.y});
      //   if(targetTile.properties.interactive) {
      //     this.interact('player', targetTile);
      //   }
      } else {
        this.gridEngine.moveTo('player', {x: targetTile.x, y: targetTile.y});
      }
    }


    // TODO: Replace with on.('pointerdown')?
    // Check if user clicked

    // if(this.pointer.isDown) {
    // if(this.pointer.isDown) {
    //   let targetTile = manipulablesLayerData[pointerY][pointerX];

      // BUG: Character automatically moves onto the rock's position, if the user clicked onto that rock before
      // TODO: handleRocks();
      // Check if the player has clicked on a rock

      // if((targetTile !== null) && targetTile.properties.rock){

        // If character is already adjacent to the rock, don't move, just remove the rock
    //     if( this.isAdjacentToTarget('player', pointerPosition) ) {
    //       this.map.removeTile(manipulablesLayerData[pointerY][pointerX]);
    //     }
    //     else {
    //       // TODO: Remove the rock after the player has stopped moving towards it
    //       this.gridEngine.moveTo('player', { x: pointerX, y: pointerY })
    //     }
    //   } else {
    //     this.gridEngine.moveTo ('player', { x: pointerX, y: pointerY });
    //   }
    // }
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

  }

  // TODO: Is this necessary/plausible?
  iterateOverMap(functionToExecute: Function): void {
    // let switchMarkersData = this.map.getLayer('Switch Markers').data;
    // let baseData = this.map.getLayer('Base').data;
    // let manipulablesData = this.map.getLayer('Manipulables').data;

    for (let i = 0; i < this.map.width; ++i) {
      for (let j = 0; j < this.map.height; ++j) {
        functionToExecute();
      }
    }
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
    this.characterPositions.length = 0;
  }

  /**
   * Checks if the target position is adjacent to the character
   * specified by charId.
   *
   * @param {string} charId - The id of the checked character in GridEngine
   * @param {Position} target - The target position
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
   * @return {Tilemap} - The created map
   */
  makeMapWithLayers(): Tilemap {
    const newMap = this.make.tilemap({key: mapName});
    this.tileSize = newMap.tileWidth;

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
   * Preloads the JSON file the map is based on, and also the tileset images
   * used by the map.
   */
  loadMapParts(): void {
    this.load.tilemapTiledJSON(mapName, `maps/${mapName}.json`);
    this.load.image('tilesetRockyRoadz', 'tilesets/NewSet.png');
    this.load.image('tilesetGeneral', 'tilesets/TilesetGeneral.png');
    this.load.image('tilesetSwitchMarkers', 'tilesets/TilesetSwitchMarkers.png');
  }

  /**
   * Creates a character animation from the given spritesheet. The name
   * parameter should be prefixed by one of the 8 main directions, e.g.
   * 'left', 'right', 'up-left', 'down-right', etc.
   *
   * @param {string} spritesheet - The spritesheet to create the animation from
   * @param {string} name - The name of the animation
   * @param {number} startFrame - The starting frame of the animation
   * @param {number} endFrame - The ending frame of the animation
   */
  createAnimation(spritesheet: string, name: string, startFrame: number, endFrame: number) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  /**
   * Handles the logic of an interaction between a character and an
   * interactive object, such as a rock, brick, hole, etc.
   *
   * @param {string} charId the id of the character in GridEngine that is involved in the interaction
   * @param {Tile} target the targeted interactive object
   */
  interact(charId: string, target: Tile): void {
    // TODO: Implement
    // this.gridEngine.moveTo(charId, {x: target.x, y: target.y});
  }

  /**
   * Creates the animations for all characters in the game.
   */
  createAnimations(): void {
    this.createAnimation('gruntMovement', 'up', 0, 7);
    this.createAnimation('gruntMovement', 'up-right', 8, 15);
    this.createAnimation('gruntMovement', 'right', 16, 23);
    this.createAnimation('gruntMovement', 'down-right', 24, 31);
    this.createAnimation('gruntMovement', 'down', 32, 39);
    this.createAnimation('gruntMovement', 'down-left', 40, 47);
    this.createAnimation('gruntMovement', 'left', 48, 55);
    this.createAnimation('gruntMovement', 'up-left', 56, 63);

    this.createAnimation('gruntIdle', 'up-idle', 0, 15);
    this.createAnimation('gruntIdle', 'up-right-idle', 16, 18);
    this.createAnimation('gruntIdle', 'right-idle', 32, 47);
    this.createAnimation('gruntIdle', 'down-right-idle', 48, 50);
    this.createAnimation('gruntIdle', 'down-idle', 64, 79);
    this.createAnimation('gruntIdle', 'down-left-idle', 80, 82);
    this.createAnimation('gruntIdle', 'left-idle', 96, 111);
    this.createAnimation('gruntIdle', 'up-left-idle', 112, 114);
  }

  /**
   * Handles zooming capabilities.
   *
   * @param {Camera} mainCam - The main camera of the scene
   */
  handleZoom(mainCam: Camera) {
    const maxZoom = 2.5;
    const zoomIncrement = 1/8;

    this.input.on('wheel', (pointer: any, GameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
      if ((mainCam.zoom < maxZoom) && (mainCam.displayWidth < this.map.widthInPixels)) {
        this.handleZoomOut(mainCam, deltaY, zoomIncrement);
        this.handleZoomIn(mainCam, deltaY, zoomIncrement);
      } else if (mainCam.zoom === maxZoom) {
        this.handleZoomOut(mainCam, deltaY, zoomIncrement);
      } else if (mainCam.displayWidth === this.map.widthInPixels) {
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
   * TODO
   *
   * @param {Camera} mainCam - The main camera of the scene
   */
  handleCameraScroll(mainCam: Camera) {
    this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'UP') {
        mainCam.scrollY -= this.tileSize;
      } else if (event.key === 'DOWN') {
        mainCam.scrollY += this.tileSize;
      }
    });
  }

  /**
   * TODO
   */
  handlePause() {
    this.input.keyboard.on('keydown-ESC', () => {
      // @ts-ignore
      document.getElementById('menu').style.display = 'block';
      this.scene.pause('stage');
    });
    // @ts-ignore
    document.getElementById('resume').addEventListener('click', () => {
      // @ts-ignore
      document.getElementById('menu').style.display = 'none';
      this.scene.resume('stage');
    });
    // @ts-ignore
    document.getElementById('save').addEventListener('click', () => {
      console.log('Saving...');
    });
    // @ts-ignore
    document.getElementById('load').addEventListener('click', () => {
      console.log('Loading...');
    });
    // @ts-ignore
    document.getElementById('optionz').addEventListener('click', () => {
      console.log('Optionz...');
    });
    // @ts-ignore
    document.getElementById('help').addEventListener('click', () => {
      console.log('Help...');
    });
    // @ts-ignore
    document.getElementById('quit').addEventListener('click', () => {
      window.location.href = './questz.html';
    });

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
