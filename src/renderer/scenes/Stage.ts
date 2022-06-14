import Phaser from 'phaser';
import { GridEngine, Position } from 'grid-engine';

const searchParams = new URLSearchParams(window.location.search);
const mapName = String(searchParams.get('stage'));

export class Stage extends Phaser.Scene {
  constructor() {
    super({ key: 'stage'});
  }

  gridEngine!: GridEngine;
  pointer!: Phaser.Input.Pointer;
  map!: Phaser.Tilemaps.Tilemap;
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
      frameHeight: 48
    });
    this.load.spritesheet('gruntIdle', 'animations/GruntNormalIdle.png', {
      frameWidth: 48,
      frameHeight: 48
    });
  }





  create(): void {
    this.map = this.makeMapWithLayers();

    const cursors = this.input.keyboard;
    cursors.createCursorKeys();

    this.createAnimations();

    // TODO: Add characters dynamically to GridEngine config
    let playerSprite = this.add.sprite(0, 0, 'gruntIdle');
    playerSprite.anims.play('down-idle');

    // TODO: Replace with pause menu functionality
    // this.handlePause();
    this.input.keyboard.on('keydown-ESC', () => {
      window.location.href = './questz.html'
    });

    const gridEngineConfig = {
      // TODO: Add characters dynamically, based on special tiles (SpawnTile, EnemyTile, etc.)
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          startPosition: {x: 2, y: 18},
          speed: 4
          // speed: Math.floor(10/6)
        },
      ],
      numberOfDirections: 8,
    };

    this.gridEngine.create(this.map, gridEngineConfig);
    this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
      this.gridEngine.getSprite(charId).anims.play(direction);
    });
    this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
      switch(direction) {
        case 'up': playerSprite.anims.play('up-idle');
        break;
        case 'up-right': playerSprite.anims.play('up-right-idle');
        break;
        case 'right': playerSprite.anims.play('right-idle');
        break;
        case 'down-right': playerSprite.anims.play('down-right-idle');
        break;
        case 'down': playerSprite.anims.play('down-idle');
        break;
        case 'down-left': playerSprite.anims.play('down-left-idle');
        break;
        case 'left': playerSprite.anims.play('left-idle');
        break;
        case 'up-left': playerSprite.anims.play('up-left-idle');
        break;
        default: throw new Error('Invalid animation.');
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
    // Using worldX and worldY because this way we get the correct pointer positions even when zoomed in/out
    let pointerX = Math.floor(this.input.activePointer.worldX/32);
    let pointerY = Math.floor(this.input.activePointer.worldY/32);
    let pointerPosition = { x: pointerX, y: pointerY};
    let playerPosition = this.gridEngine.getPosition('player');
    let manipulablesLayerData = this.map.getLayer('Manipulables').data;

    if(this.input.activePointer.isDown) {
      let targetTile = manipulablesLayerData[pointerY][pointerX];

      if(targetTile === undefined) {
        console.log('Cannot move outside the map.');
      }
      else if(targetTile.properties.interactive) {
        this.gridEngine.moveTo('player', { x: targetTile.x, y: targetTile.y });
      //   if(targetTile.properties.interactive) {
      //     this.interact('player', targetTile);
      //   }
      }
      else {
        this.gridEngine.moveTo('player', { x: targetTile.x, y: targetTile.y });
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
   */
  handleMoveArrows(): void {

  }


  // TODO: Implement
  /**
   * Handles the logic involving the rocks Gruntz may encounter.
   * Visually these can be diverse, like rocks, cakes, dice, etc.
   */
  handleRocks(data: Phaser.Tilemaps.Tile[][]): void {

  }


  // TODO: Implement
  /**
   * Handles the logic involving the buildable and also breakable
   * bricks the player may encounter.
   */
  handleBricks(): void {


  }

  // TODO: Is this necessary/plausible?
  iterateOverMap(functionToExecute: Function): void {
    // let switchMarkersData = this.map.getLayer('Switch Markers').data;
    // let baseData = this.map.getLayer('Base').data;
    // let manipulablesData = this.map.getLayer('Manipulables').data;

    for(let i = 0; i < this.map.width; ++i) {
      for(let j = 0; j < this.map.height; ++j) {
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
    // Clear positions, so that updated positions don't get written after the obsolete ones
    this.characterPositions.length = 0;

  }

  /**
   * Checks if the pointer position is adjacent to the character specified by charId.
   *
   * @param charId the id of the checked character in GridEngine
   * @param target the target position
   */
  isAdjacentToTarget(charId: string, target: Position): boolean {

    let charPosition = this.gridEngine.getPosition(charId);
    let dx:number = Math.abs(charPosition.x - target.x);
    let dy:number = Math.abs(charPosition.y - target.y);

    if(dx <= 1 && dy <= 1) {
      return (dx + dy === 1 || dx + dy === 2);
    } else {
      return false;
    }
  }

  /**
   * Creates the map and populates it with the different layers
   * used for the game logic.
   */
  makeMapWithLayers(): Phaser.Tilemaps.Tilemap {

    let newMap = this.make.tilemap({ key: mapName });
    this.tileSize = newMap.tileWidth;

    // Add tileset images
    const tilesetSwitchMarkers = newMap.addTilesetImage('TilesetSwitchMarkers', 'tilesetSwitchMarkers');
    const tilesetBase = newMap.addTilesetImage('NewSet', 'tilesetRockyRoadz');
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
   * parameter is prefixed by a direction, e.g. 'left', 'right', 'up-left',
   * 'down-right', etc.
   *
   * @param spritesheet the spritesheet to create the animation from
   * @param name the name of the animation
   * @param startFrame the starting frame of the animation
   * @param endFrame the ending frame of the animation
   */
  createAnimation(spritesheet: string, name: string, startFrame: number, endFrame: number) {

    this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(spritesheet, {
            start: startFrame,
            end: endFrame
        }),
        frameRate: 10,
        repeat:  -1
    });
  }

  /**
   * Handles the logic of an interaction between a character and an
   * interactive object, such as a rock, brick, hole, etc.
   *
   * @param charId the id of the character in GridEngine that is involved in the interaction
   * @param target the targeted interactive object
   */
  interact(charId: string, target: Phaser.Tilemaps.Tile): void {
    // TODO: Implement
    this.gridEngine.moveTo(charId, { x: target.x, y: target.y });
  }


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
   * Handles the zooming capabilities.
   *
   * @param mainCam the main camera of the scene
   */
  handleZoom(mainCam: Phaser.Cameras.Scene2D.Camera) {
    let maxZoom = 2.5;
    let zoomIncrement = 1/8;

    this.input.on('wheel', (pointer: any, GameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
      if((mainCam.zoom < maxZoom) && (mainCam.displayWidth < this.map.widthInPixels)) {
        this.handleZoomOut(mainCam, deltaY, zoomIncrement);
        this.handleZoomIn(mainCam, deltaY, zoomIncrement);
      } else if(mainCam.zoom === maxZoom) {
        this.handleZoomOut(mainCam, deltaY, zoomIncrement);
      } else if(mainCam.displayWidth === this.map.widthInPixels) {
        this.handleZoomIn(mainCam, deltaY, zoomIncrement);
      }
    });
  }
  handleZoomIn(mainCam: Phaser.Cameras.Scene2D.Camera, deltaY: number, zoomIncrement: number): void {
    if(deltaY < 0) { mainCam.zoom += zoomIncrement; }
  }
  handleZoomOut(mainCam: Phaser.Cameras.Scene2D.Camera, deltaY: number, zoomIncrement: number): void {
    if(deltaY > 0) { mainCam.zoom -= zoomIncrement; }
  }
}
