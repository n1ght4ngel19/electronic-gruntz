import Phaser from 'phaser';
import { GridEngine, Position } from 'grid-engine';

const searchParams = new URLSearchParams(window.location.search);
const mapName = String(searchParams.get('stage'));

export class Stage extends Phaser.Scene {
  
  constructor() {
    super({ key: 'stage'});
  }

  gridEngine!: GridEngine;
  map!: Phaser.Tilemaps.Tilemap;
  map2!: Phaser.Tilemaps.Tilemap;
  pointer!: Phaser.Input.Pointer;
  pointerPosition!: Position;
  // TODO: Set this dynamically
  tileSize: number = 32;
  // TODO: Populate this dynamically
  characterPositions!: Position[];
  playerPosition!: Position;
  // layer data




  preload(): void {

    this.loadMapParts();

    // Load tester Grunt image    
    this.load.image('grunt', 'animations/Grunt.png');
  }





  create(): void {

    // Ensure that rightclick-menu doesn't appear
    this.input.mouse.disableContextMenu();

    this.pointer = this.input.activePointer;
    
    this.input.keyboard.on('keydown-ESC', () => {
      window.location.href = 'questz.html';
    });


    // this.input.keyboard.on('keydown-A', () => {
      // this.cameras.main.setZoom(1.1);
    // });

    // this.cameras.main.roundPixels = true;

    // TODO: Make zoom smooth
    // BUG: Can zoom outside the map boundaries
    // BUG: Cannot move view on the map manually
    this.input.on('wheel', (pointer: any, GameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
      if(deltaY < 0) {
        this.cameras.main.zoom += .5;
      }
      if(deltaY > 0) {
        this.cameras.main.zoom -= .5;
      }
    })






    // Create tilemap
    // this.map = this.make.tilemap({ key: 'stageRockyRoadz01' });

    this.map = this.makeMapWithLayers();

    // Add tileset images
    // const tileset1 = this.map.addTilesetImage('TilesetSwitchMarkers', 'tilesetSwitchMarkers');
    // const tileset2 = this.map.addTilesetImage('NewSet', 'tilesetRockyRoadz');
    // const tileset3 = this.map.addTilesetImage('TilesetGeneral', 'tilesetGeneral');

    // Create layers
    // this.map.createLayer('Switch Markers', tileset1);
    // this.map.createLayer('Base', tileset2);
    // this.map.createLayer('Manipulables', tileset3);

    // Create player sprite
    const playerSprite = this.add.sprite(0, 0, 'grunt');

    const gridEngineConfig = {
      // TODO: Add characters dynamically, based on special tiles (SpawnTile, EnemyTile, etc.)
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          startPosition: {x: 2, y: 18},
          speed: 4
        },
      ],
      numberOfDirections: 8,
    };

    this.gridEngine.create(this.map, gridEngineConfig);

    // Look into this, maybe not working
    // Possibly together with zoom function?
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels+64, this.map.heightInPixels+64);
    this.cameras.main.startFollow(this.gridEngine.getSprite('player'));
  }




  update(): void {
    
    // Using worldX and worldY because this way we get the
    // correct pointer positions even wheen zoomed in/out
    let pointerX = Math.floor(this.pointer.worldX/32);
    let pointerY = Math.floor(this.pointer.worldY/32);
    this.pointerPosition = { x: pointerX, y: pointerY};
    
    // TODO: Update all character positions each frame
    this.playerPosition = this.gridEngine.getPosition('player');


    // TODO: Don't create this every frame
    let cursors = this.input.keyboard;
    cursors.createCursorKeys();


    let manipulablesLayerData = this.map.getLayer('Manipulables').data;

    
    
    // TODO: Replace with on.('pointerdown')?
    // Check if user clicked
    if( this.pointer.isDown ) {

      let pointedTile = manipulablesLayerData[pointerY][pointerX];
      
      // BUG: Character automatically moves onto the rock's position, if the user clicked onto that rock before
      // TODO: handleRocks();
      // Check if the player has clicked on a rock
      if((pointedTile !== null) &&  pointedTile.properties.rock){

        // If character is already adjacent to the rock, don't move, just remove the rock
        if( this.isAdjacentToTarget('player', this.pointerPosition) ) {
          this.map.removeTile(manipulablesLayerData[pointerY][pointerX]);
        }
        else {

          this.gridEngine.moveTo('player', { x: pointerX, y: pointerY });
          
          // Remove the rock only after the player has stopped moving towards it
          // if( !this.gridEngine.isMoving('player') ) {

          //   this.map.removeTile(manipulablesLayerData[pointerY][pointerX]);
          // }
        }
      } else {
        this.gridEngine.moveTo('player', { x: pointerX, y: pointerY });
      }
    }
  }
  



  // TODO: Empty function
  /**
   * Handles commands given by the player to their active Grunt/Gruntz.
   */
  handleCommand(): void {


  }


  // TODO: Empty function
  /**
   * Handles the logic involving the arrows that force Gruntz to move
   * in a specific direction.
   */
  handleMoveArrows(): void {

  }


  // TODO: Empty function
  /**
   * Handles the logic involving the rocks Gruntz may encounter.
   * Visually these can be diverse, like rocks, cakes, dice, etc.
   */
  handleRocks(data: Phaser.Tilemaps.Tile[][]): void {


  }


  // TODO: Empty function
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

  // TODO: Empty function
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
   */
  isAdjacentToTarget(charId: string, target: Position): boolean {
    
    let charPosition = this.gridEngine.getPosition(charId);
    let dx:number = Math.abs(charPosition.x - target.x);
    let dy:number = Math.abs(charPosition.y - target.y);

    if(dx <= 1 && dy <= 1) {
      return (dx + dy === 1 || dx + dy === 2);
    }
    else {
      return false;
    }
  }

  makeMapWithLayers(): Phaser.Tilemaps.Tilemap {
  
    let newMap = this.make.tilemap({ key: 'stageRockyRoadz01' });

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

  loadMapParts(): void {

    this.load.tilemapTiledJSON(mapName, `maps/${mapName}.json`);
    // this.load.tilemapTiledJSON('stageRockyRoadz01', `maps/stageRockyRoadz01.json`);
    this.load.image('tilesetRockyRoadz', 'tilesets/NewSet.png');
    this.load.image('tilesetGeneral', 'tilesets/TilesetGeneral.png');
    this.load.image('tilesetSwitchMarkers', 'tilesets/TilesetSwitchMarkers.png');
  }

}
