import {Stage} from './Stage';
import Tilemap = Phaser.Tilemaps.Tilemap;

export class AssetHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the class will work on
   */
  constructor(stage: Stage) {
    this.stage = stage;
  };

  stage: Stage;

  loadMapAndTilesets(mapName: string, tilesetName: string): void {
    this.stage.load.tilemapTiledJSON(mapName, `maps/${mapName}.json`);
    this.stage.load.image(
        tilesetName,
        `tilesets/${tilesetName}.png`);
    this.stage.load.image(
        'tilesetGeneral',
        'tilesets/tilesetGeneral.png');
    this.stage.load.image(
        'tilesetBrickz',
        'tilesets/tilesetBrickz.png');
    this.stage.load.image(
        'tilesetMarkerz',
        'tilesets/tilesetMarkerz.png',
    );
  }

  loadAnimationAtlases(): void {
    this.stage.load.atlasXML('NORMALGRUNT', 'animations/ANIMS/NORMALGRUNT.png', 'animations/ANIMS/NORMALGRUNT.xml');
  }

  /**
   * Creates the map and populates it with the different layers
   * used for the game logic.
   *
   * @param {string} mapName - The name of the map which corresponds to the filename of the map in JSON format
   *
   * @return {Tilemap} - The map that is to be used in the game
   */
  makeMapWithLayers(mapName: string, tilesetName: string): Tilemap {
    const returnMap = this.stage.make.tilemap({key: mapName});

    // Add tilesets to create the map layers from
    // TODO: Dynamic tileWidth and tileHeight, specified in Area, together with how big Grunt textures the Area should use
    this.stage.baseLayer = returnMap.addTilesetImage(tilesetName, tilesetName, 32, 32);
    this.stage.generalLayer = returnMap.addTilesetImage('tilesetGeneral', 'tilesetGeneral');
    this.stage.brickLayer = returnMap.addTilesetImage('tilesetBrickz', 'tilesetBrickz');
    this.stage.markerLayer = returnMap.addTilesetImage('tilesetMarkerz', 'tilesetMarkerz');

    // Create map layers
    returnMap.createLayer('baseLayer', this.stage.baseLayer);
    returnMap.createLayer('generalLayer', this.stage.generalLayer);
    returnMap.createLayer('brickLayer', this.stage.brickLayer);
    returnMap.createLayer('markerLayer', this.stage.markerLayer);

    return returnMap;
  }
}
