import Phaser, { Tilemaps } from 'phaser';
import { GridEngine, Position } from 'grid-engine';

export class Stage extends Phaser.Scene {
  
  constructor() {
    super({ key: 'stage'});
  }

  gridEngine!: GridEngine;
  map!: Phaser.Tilemaps.Tilemap;
  pointer!: Phaser.Input.Pointer;
  // TODO: Set this dynamically
  tileSize: number = 32;
  // TODO: Populate this dynamically
  characterPositions!: Position[];
  playerPosition!: Position;
  // pointer
  // layer data




  preload(): void {

    this.load.tilemapTiledJSON('stageRockyRoadz01', 'maps/StageRockyRoadz01.json');
    this.load.image('tilesetRockyRoadz', 'tilesets/NewSet.png');
    this.load.image('tilesetGeneral', 'tilesets/TilesetGeneral.png');
    this.load.image('tilesetSwitchMarkers', 'tilesets/TilesetSwitchMarkers.png');

    // Load tester Grunt image    
    this.load.image('grunt', 'animations/Grunt.png');
  }





  create(): void {

    // Ensure that rightclick-menu doesn't appear
    this.input.mouse.disableContextMenu();

    this.pointer = this.input.activePointer;
    
    // Create tilemap
    this.map = this.make.tilemap({ key: 'stageRockyRoadz01' });

    // Add tileset images
    const tileset1 = this.map.addTilesetImage('TilesetSwitchMarkers', 'tilesetSwitchMarkers');
    const tileset2 = this.map.addTilesetImage('NewSet', 'tilesetRockyRoadz');
    const tileset3 = this.map.addTilesetImage('TilesetGeneral', 'tilesetGeneral');

    // Create layers
    this.map.createLayer('Switch Markers', tileset1);
    this.map.createLayer('Base', tileset2);
    this.map.createLayer('Manipulables', tileset3);

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
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
  }





  update(): void {

    // Update playerPosition each frame
    this.playerPosition = this.gridEngine.getPosition('player');
    // TODO: Update all character positions each frame

    // TODO: Don't create this every frame
    let cursors = this.input.keyboard;
    cursors.createCursorKeys();


    let pointerX = Math.floor(this.pointer.downX/32);
    let pointerY = Math.floor(this.pointer.downY/32);

    
    
    if(this.pointer.isDown) { this.gridEngine.moveTo('player', { x: pointerX, y: pointerY }); }
    
    if(this.input.activePointer.isDown) {
      let manipulablesLayerData = this.map.getLayer('Manipulables').data;
      
      // Hide/Explode rock if clicked on
      if(manipulablesLayerData[pointerY][pointerX] !== null &&  manipulablesLayerData[pointerY][pointerX].properties.rock) {

        this.map.removeTile(manipulablesLayerData[pointerY][pointerX]);
      }
    }
  }
  




  handleMoveArrows(): void {

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

  setCharacterPositions(): void {
    // Clear positions, so that updated positions don't get written after the obsolete ones
    this.characterPositions.length = 0;

  }
}