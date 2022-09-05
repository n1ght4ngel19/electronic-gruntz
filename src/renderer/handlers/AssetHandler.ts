import {Stage} from '../Stage';
import Tilemap = Phaser.Tilemaps.Tilemap;
import {GruntType} from '../gruntz/GruntType';

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
    this.stage.load.tilemapTiledJSON(
        mapName,
        `maps/${mapName}.json`);
    this.stage.load.image(
        tilesetName,
        `tilesets/${tilesetName}.png`);
    this.stage.load.image(
        'actionBrick',
        'tilesets/actionBrick.png');
    this.stage.load.image(
        'arrowz',
        'tilesets/arrowz.png');
    this.stage.load.image(
        'bridgez',
        'tilesets/bridgez.png');
    this.stage.load.image(
        'giantRockz',
        'tilesets/giantRockz.png');
    this.stage.load.image(
        'hazardz',
        'tilesets/hazardz.png');
    this.stage.load.image(
        'holez',
        'tilesets/holez.png');
    this.stage.load.image(
        'pyramidz',
        'tilesets/pyramidz.png');
    this.stage.load.image(
        'rockz',
        'tilesets/rockz.png');
    this.stage.load.image(
        'switchez',
        'tilesets/switchez.png');
    this.stage.load.image(
        'toolz',
        'tilesets/toolz.png');
    this.stage.load.image(
        'markerz',
        'tilesets/markerz.png');
  }

  loadAnimationAtlases(): void {
    this.stage.load.atlasXML(
        GruntType.NORMAL_GRUNT,
        `animations/gruntz/${GruntType.NORMAL_GRUNT}.png`,
        `animations/gruntz/${GruntType.NORMAL_GRUNT}.xml`);
    this.stage.load.atlasXML(
        GruntType.CLUB_GRUNT,
        `animations/gruntz/${GruntType.CLUB_GRUNT}.png`,
        `animations/gruntz/${GruntType.CLUB_GRUNT}.xml`);
    this.stage.load.atlasXML(
        GruntType.GAUNTLETZ_GRUNT,
        `animations/gruntz/${GruntType.GAUNTLETZ_GRUNT}.png`,
        `animations/gruntz/${GruntType.GAUNTLETZ_GRUNT}.xml`);
    this.stage.load.atlasXML(
        'pickupz',
        'animations/gruntz/pickupz.png',
        'animations/gruntz/pickupz.xml');
    this.stage.load.atlasXML(
        'barAnimationz',
        'animations/gruntz/barz.png',
        'animations/gruntz/barz.xml');
  }

  loadTileAnimationAtlases(): void {
    this.stage.load.atlasXML(
        'bridgeAnimationz',
        'animations/tilez/bridgeAnimationz.png',
        'animations/tilez/bridgeAnimationz.xml');
    this.stage.load.atlasXML(
        'pyramidAnimationz',
        `animations/tilez/pyramidz.png`,
        `animations/tilez/pyramidz.xml`);
    this.stage.load.atlasXML(
        'switchAnimationz',
        `animations/tilez/switchez.png`,
        `animations/tilez/switchez.xml`);
    this.stage.load.atlasXML(
        'eyeCandy',
        `animations/tilez/eyeCandy.png`,
        `animations/tilez/eyeCandy.xml`);
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
    returnMap.addTilesetImage(tilesetName);
    returnMap.addTilesetImage('actionBrick');
    returnMap.addTilesetImage('arrowz');
    returnMap.addTilesetImage('bridgez');
    returnMap.addTilesetImage('giantRockz');
    returnMap.addTilesetImage('markerz');
    returnMap.addTilesetImage('hazardz');
    returnMap.addTilesetImage('holez');
    returnMap.addTilesetImage('pyramidz');
    returnMap.addTilesetImage('rockz');
    returnMap.addTilesetImage('switchez');
    returnMap.addTilesetImage('toolz');

    // Create map layers
    this.stage.baseLayer = returnMap.createLayer(
        'baseLayer',
        [
          tilesetName,
          'arrowz',
          'actionBrick',
          'bridgez',
          'giantRockz',
          'hazardz',
          'holez',
          'pyramidz',
          'rockz',
          'switchez',
        ],
    );
    this.stage.actionLayer = returnMap.createLayer(
        'actionLayer',
        [
          tilesetName,
          'arrowz',
          'actionBrick',
          'bridgez',
          'giantRockz',
          'hazardz',
          'holez',
          'pyramidz',
          'rockz',
          'switchez',
        ],
    );
    this.stage.secretLayer = returnMap.createLayer(
        'secretLayer',
        [
          tilesetName,
          'arrowz',
          'actionBrick',
          'bridgez',
          'giantRockz',
          'hazardz',
          'holez',
          'pyramidz',
          'rockz',
          'switchez',
        ],
    );
    this.stage.itemLayer = returnMap.createLayer(
        'itemLayer',
        'toolz',
    );
    // @ts-ignore
    this.stage.mapObjects = returnMap.createFromObjects('mapObjects');
    // @ts-ignore
    this.stage.eyeCandy = returnMap.createFromObjects('eyeCandy');

    return returnMap;
  }
}
