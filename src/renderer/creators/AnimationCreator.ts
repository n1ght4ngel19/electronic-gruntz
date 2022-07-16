import {Stage} from '../Stage';
import Texture = Phaser.Textures.Texture;
import {GruntType} from '../gruntz/GruntType';

export class AnimationCreator {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the class will work on
   */
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

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
  private findFrameCount(atlas: Texture, animPrefix: string): number {
    let count = 0;

    atlas.getFrameNames().forEach((frameName) => {
      if (frameName.startsWith(animPrefix)) {
        count++;
      }
    });

    return count;
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
  private createAtlasAnimation(atlasKey: string, animKey: string, animPrefix: string): void {
    this.stage.anims.create({
      key: animKey,
      repeat: -1,
      frameRate: 10,
      frames: this.stage.anims.generateFrameNames(atlasKey, {
        prefix: animPrefix,
        start: 1,
        end: this.findFrameCount(this.stage.textures.get(atlasKey), animPrefix),
        zeroPad: 2,
      }),
    });
  }

  private createPickupAnimation(atlasKey: string, animKey: string, animPrefix: string): void {
    this.stage.anims.create({
      key: animKey,
      repeat: 1,
      frameRate: 10,
      frames: this.stage.anims.generateFrameNames(atlasKey, {
        prefix: 'pickup_',
        start: 1,
        end: 3,
        zeroPad: 2,
      }),
    });

    this.stage.anims.get(animKey).addFrame(this.stage.anims.generateFrameNames(atlasKey, {
      prefix: animPrefix,
      start: 1,
      end: 1,
      zeroPad: 2,
    }));
  }

  /**
   * Creates all the animations from the texture atlas identified by the atlasKey parameter.
   *
   * @param {string} atlasKey - The key of the texture atlas we are creating the animations from
   */
  private createAtlasAnimations(atlasKey: string, gruntType: GruntType): void {
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthAttack`, 'NORTH_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastAttack`, 'NORTHEAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}EastAttack`, 'EAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastAttack`, 'SOUTHEAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthAttack`, 'SOUTH_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestAttack`, 'SOUTHWEST_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}WestAttack`, 'WEST_ATTACK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestAttack`, 'NORTHWEST_ATTACK_');

    this.createAtlasAnimation(atlasKey, `${gruntType}NorthIdle`, 'NORTH_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastIdle`, 'NORTHEAST_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}EastIdle`, 'EAST_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastIdle`, 'SOUTHEAST_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthIdle`, 'SOUTH_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestIdle`, 'SOUTHWEST_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}WestIdle`, 'WEST_IDLE_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestIdle`, 'NORTHWEST_IDLE_');

    // this.createAtlasAnimation(atlasKey, `${gruntType}NorthItem`, 'NORMALGRUNT_NORTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastItem`, 'NORMALGRUNT_NORTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}EastItem`, 'NORMALGRUNT_EAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastItem`, 'NORMALGRUNT_SOUTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}SouthItem`, 'NORMALGRUNT_SOUTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestItem`, 'NORMALGRUNT_SOUTHWEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}WestItem`, 'NORMALGRUNT_WEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestItem`, 'NORMALGRUNT_NORTHWEST_ITEM_');

    this.createAtlasAnimation(atlasKey, `${gruntType}NorthStruck`, 'NORTH_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastStruck`, 'NORTHEAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}EastStruck`, 'EAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastStruck`, 'SOUTHEAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthStruck`, 'SOUTH_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestStruck`, 'SOUTHWEST_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}WestStruck`, 'WEST_STRUCK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestStruck`, 'NORTHWEST_STRUCK_');

    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWalk`, 'NORTH_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastWalk`, 'NORTHEAST_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}EastWalk`, 'EAST_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastWalk`, 'SOUTHEAST_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWalk`, 'SOUTH_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestWalk`, 'SOUTHWEST_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}WestWalk`, 'WEST_WALK_');
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestWalk`, 'NORTHWEST_WALK_');
  }

  createPickupAnimations(): void {
    this.createPickupAnimation('pickupz', 'clubPickup', 'toolClub_');
    this.createPickupAnimation('pickupz', 'gauntletzPickup', 'toolGauntletz_');
  }

  createAllAnimationAtlases(): Texture[] {
    const atlases: Texture[] = [];

    atlases.push(this.stage.textures.get('normalGrunt'));
    atlases.push(this.stage.textures.get('clubGrunt'));
    atlases.push(this.stage.textures.get('gauntletzGrunt'));

    return atlases;
  }

  createAllAtlasAnimations(atlases: Texture[]): void {
    this.createAtlasAnimations(atlases[0].key, GruntType.normalGrunt);
    this.createAtlasAnimations(atlases[1].key, GruntType.clubGrunt);
    this.createAtlasAnimations(atlases[2].key, GruntType.gauntletzGrunt);
  }
}
