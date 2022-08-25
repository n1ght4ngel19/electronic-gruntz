import {Stage} from '../Stage';
import Tilemap = Phaser.Tilemaps.Tilemap;
import {Area} from '../Area';
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
        'actionArrow',
        'tilesets/actionArrow.png');
    this.stage.load.image(
        'actionBrick',
        'tilesets/actionBrick.png');
    this.stage.load.image(
        'actionBridge',
        'tilesets/actionBridge.png');
    this.stage.load.image(
        'actionGiantRock',
        'tilesets/actionGiantRock.png');
    this.stage.load.image(
        'actionHazard',
        'tilesets/actionHazard.png');
    this.stage.load.image(
        'actionHole',
        'tilesets/actionHole.png');
    this.stage.load.image(
        'actionPyramid',
        'tilesets/actionPyramid.png');
    this.stage.load.image(
        'actionRock',
        'tilesets/actionRock.png');
    this.stage.load.image(
        'actionSwitch',
        'tilesets/actionSwitch.png');
    this.stage.load.image(
        'itemTool',
        'tilesets/itemTool.png');
    this.stage.load.image(
        'markerGrunt',
        'tilesets/markerGrunt.png');
    this.stage.load.image(
        'markerLogic',
        'tilesets/markerLogic.png');
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
  }

  loadTileAnimationAtlases(): void {
    this.stage.load.atlasXML(
        Area.ROCKY_ROADZ,
        `animations/tilez/${Area.ROCKY_ROADZ}.png`,
        `animations/tilez/${Area.ROCKY_ROADZ}.xml`);
    this.stage.load.atlasXML(
        'pyramidz',
        `animations/tilez/pyramidz.png`,
        `animations/tilez/pyramidz.xml`);
    this.stage.load.atlasXML(
        'switchez',
        `animations/tilez/switchez.png`,
        `animations/tilez/switchez.xml`);
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
    returnMap.addTilesetImage('actionArrow');
    returnMap.addTilesetImage('actionBrick');
    returnMap.addTilesetImage('actionBridge');
    returnMap.addTilesetImage('actionGiantRock');
    returnMap.addTilesetImage('actionHazard');
    returnMap.addTilesetImage('actionHole');
    returnMap.addTilesetImage('actionPyramid');
    returnMap.addTilesetImage('actionRock');
    returnMap.addTilesetImage('actionSwitch');
    returnMap.addTilesetImage('itemTool');
    returnMap.addTilesetImage('markerGrunt');
    returnMap.addTilesetImage('markerLogic');

    // Create map layers
    this.stage.baseLayer = returnMap.createLayer(
        'baseLayer',
        [
          tilesetName,
          'actionArrow',
          'actionBrick',
          'actionBridge',
          'actionGiantRock',
          'actionHazard',
          'actionHole',
          'actionPyramid',
          'actionRock',
          'actionSwitch',
        ],
    );
    this.stage.actionLayer = returnMap.createLayer(
        'actionLayer',
        [
          tilesetName,
          'actionArrow',
          'actionBrick',
          'actionBridge',
          'actionGiantRock',
          'actionHazard',
          'actionHole',
          'actionPyramid',
          'actionRock',
          'actionSwitch',
        ],
    );
    this.stage.secretLayer = returnMap.createLayer(
        'secretLayer',
        [
          tilesetName,
          'actionArrow',
          'actionBrick',
          'actionBridge',
          'actionGiantRock',
          'actionHazard',
          'actionHole',
          'actionPyramid',
          'actionRock',
          'actionSwitch',
        ],
    );
    this.stage.itemLayer = returnMap.createLayer(
        'itemLayer',
        'itemTool',
    );
    // @ts-ignore
    this.stage.mapObjects = returnMap.createFromObjects('mapObjects');

    return returnMap;
  }
}
