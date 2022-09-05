import {Stage} from '../Stage';
import Texture = Phaser.Textures.Texture;
import {GruntType} from '../gruntz/GruntType';
import {Area} from '../Area';

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

  createAllAnimationAtlases(): Texture[] {
    const atlases: Texture[] = [];

    atlases.push(this.stage.textures.get(GruntType.NORMAL_GRUNT));
    atlases.push(this.stage.textures.get(GruntType.CLUB_GRUNT));
    atlases.push(this.stage.textures.get(GruntType.GAUNTLETZ_GRUNT));
    atlases.push(this.stage.textures.get('barz'));
    return atlases;
  }

  createAllAtlasAnimations(atlases: Texture[]): void {
    this.createAllPickupAnimations();
    this.createBarAnimations();
    this.createAtlasAnimations(atlases[0].key, GruntType.NORMAL_GRUNT);
    this.createAtlasAnimations(atlases[1].key, GruntType.CLUB_GRUNT);
    this.createAtlasAnimations(atlases[2].key, GruntType.GAUNTLETZ_GRUNT);
  }

  // private createAtlasAnimations(atlasKey: string, gruntType: GruntType): void {
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthAttack`, 'NORTH_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastAttack`, 'NORTHEAST_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}EastAttack`, 'EAST_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastAttack`, 'SOUTHEAST_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthAttack`, 'SOUTH_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestAttack`, 'SOUTHWEST_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}WestAttack`, 'WEST_ATTACK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestAttack`, 'NORTHWEST_ATTACK_', 10, -1);
  //
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthIdle`, 'NORTH_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastIdle`, 'NORTHEAST_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}EastIdle`, 'EAST_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastIdle`, 'SOUTHEAST_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthIdle`, 'SOUTH_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestIdle`, 'SOUTHWEST_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}WestIdle`, 'WEST_IDLE_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestIdle`, 'NORTHWEST_IDLE_', 10, -1);
  //
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}NorthItem`, 'NORMALGRUNT_NORTH_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastItem`, 'NORMALGRUNT_NORTHEAST_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}EastItem`, 'NORMALGRUNT_EAST_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastItem`, 'NORMALGRUNT_SOUTHEAST_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}SouthItem`, 'NORMALGRUNT_SOUTH_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestItem`, 'NORMALGRUNT_SOUTHWEST_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}WestItem`, 'NORMALGRUNT_WEST_ITEM_');
  //   // this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestItem`, 'NORMALGRUNT_NORTHWEST_ITEM_');
  //
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthStruck`, 'NORTH_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastStruck`, 'NORTHEAST_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}EastStruck`, 'EAST_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastStruck`, 'SOUTHEAST_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthStruck`, 'SOUTH_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestStruck`, 'SOUTHWEST_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}WestStruck`, 'WEST_STRUCK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestStruck`, 'NORTHWEST_STRUCK_', 10, -1);
  //
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthWalk`, 'NORTH_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastWalk`, 'NORTHEAST_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}EastWalk`, 'EAST_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastWalk`, 'SOUTHEAST_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthWalk`, 'SOUTH_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestWalk`, 'SOUTHWEST_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}WestWalk`, 'WEST_WALK_', 10, -1);
  //   this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestWalk`, 'NORTHWEST_WALK_', 10, -1);
  // }
  //
  private createAtlasAnimations(atlasKey: string, gruntType: GruntType): void {
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthAttack`, `${gruntType}NorthAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastAttack`, `${gruntType}NorthEastAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}EastAttack`, `${gruntType}EastAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastAttack`, `${gruntType}SouthEastAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthAttack`, `${gruntType}SouthAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestAttack`, `${gruntType}SouthWestAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}WestAttack`, `${gruntType}WestAttack_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestAttack`, `${gruntType}NorthWestAttack_`, 10, -1);

    this.createAtlasAnimation(atlasKey, `${gruntType}NorthIdle`, `${gruntType}NorthIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastIdle`, `${gruntType}NorthEastIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}EastIdle`, `${gruntType}EastIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastIdle`, `${gruntType}SouthEastIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthIdle`, `${gruntType}SouthIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestIdle`, `${gruntType}SouthWestIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}WestIdle`, `${gruntType}WestIdle_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestIdle`, `${gruntType}NorthWestIdle_`, 10, -1);

    // this.createAtlasAnimation(atlasKey, `${gruntType}NorthItem`, 'NORMALGRUNT_NORTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastItem`, 'NORMALGRUNT_NORTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}EastItem`, 'NORMALGRUNT_EAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastItem`, 'NORMALGRUNT_SOUTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}SouthItem`, 'NORMALGRUNT_SOUTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestItem`, 'NORMALGRUNT_SOUTHWEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}WestItem`, 'NORMALGRUNT_WEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestItem`, 'NORMALGRUNT_NORTHWEST_ITEM_');

    this.createAtlasAnimation(atlasKey, `${gruntType}NorthStruck`, `${gruntType}NorthStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastStruck`, `${gruntType}NorthEastStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}EastStruck`, `${gruntType}EastStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastStruck`, `${gruntType}SouthEastStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthStruck`, `${gruntType}SouthStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestStruck`, `${gruntType}SouthWestStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}WestStruck`, `${gruntType}WestStruck_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestStruck`, `${gruntType}NorthWestStruck_`, 10, -1);

    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWalk`, `${gruntType}NorthWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthEastWalk`, `${gruntType}NorthEastWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}EastWalk`, `${gruntType}EastWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthEastWalk`, `${gruntType}SouthEastWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWalk`, `${gruntType}SouthWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}SouthWestWalk`, `${gruntType}SouthWestWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}WestWalk`, `${gruntType}WestWalk_`, 10, -1);
    this.createAtlasAnimation(atlasKey, `${gruntType}NorthWestWalk`, `${gruntType}NorthWestWalk_`, 10, -1);
  }

  createBarAnimations(): void {
    this.createAtlasAnimation('barAnimationz', 'healthBar', 'BarHealth_', 0, 0);
    this.createAtlasAnimation('barAnimationz', 'staminaBar', 'BarStamina_', 0, 0);
    this.createAtlasAnimation('barAnimationz', 'toyTimeBar', 'BarToyTime_', 0, 0);
    this.createAtlasAnimation('barAnimationz', 'wingzTimeBar', 'BarWingzTime_', 0, 0);
  }

  // -------------------------------------------------------

  createAllTileAnimationAtlases(): Texture[] {
    const atlases: Texture[] = [];

    atlases.push(this.stage.textures.get('bridgeAnimationz'));
    atlases.push(this.stage.textures.get('pyramidAnimationz'));
    atlases.push(this.stage.textures.get('switchAnimationz'));
    return atlases;
  }

  createAllTileAtlasAnimations(area: Area): void {
    this.createTileAtlasAnimations(area);
    this.createPyramidAndSwitchAnimations();
  }

  private createTileAtlasAnimations(area: Area): void {
    this.createAtlasAnimation('bridgeAnimationz', `${area}_DeathBridge`, `${area}_DeathBridge_`, 30, 0);
    this.createAtlasAnimation('bridgeAnimationz', `${area}_DeathBridgeCrumble`, `${area}_DeathBridgeCrumble_`, 30, 0);
    this.createAtlasAnimation('bridgeAnimationz', `${area}_DeathBridgeToggle`, `${area}_DeathBridgeToggle_`, 30, 0);
    this.createAtlasAnimation('bridgeAnimationz', `${area}_WaterBridge`, `${area}_WaterBridge_`, 30, 0);
    this.createAtlasAnimation('bridgeAnimationz', `${area}_WaterBridgeCrumble`, `${area}_WaterBridgeToggle_`, 30, 0);
    this.createAtlasAnimation('bridgeAnimationz', `${area}_WaterBridgeToggle`, `${area}_WaterBridgeCrumble_`, 30, 0);
  }

  private createPyramidAndSwitchAnimations() {
    this.createAtlasAnimation('pyramidAnimationz', 'BlackPyramid', 'PyramidBlack_', 30, 0);
    this.createAtlasAnimation('pyramidAnimationz', 'CheckPointPyramid', 'PyramidCheckPoint_', 30, 0);
    this.createAtlasAnimation('pyramidAnimationz', 'GreenPyramid', 'PyramidGreen_', 30, 0);
    this.createAtlasAnimation('pyramidAnimationz', 'OrangePyramid', 'PyramidOrange_', 30, 0);
    this.createAtlasAnimation('pyramidAnimationz', 'PurplePyramid', 'PyramidPurple_', 30, 0);
    this.createAtlasAnimation('pyramidAnimationz', 'RedPyramid', 'PyramidRed_', 30, 0);
    this.createAtlasAnimation('pyramidAnimationz', 'SilverPyramid', 'PyramidSilver_', 30, 0);
    this.createAtlasAnimation('switchAnimationz', 'SecretSwitch', 'SwitchSecret_', 10, 0);
    this.createAtlasAnimation('switchAnimationz', 'ArrowHoldSwitch', 'SwitchArrowHold_', 10, 0);
    this.createAtlasAnimation('switchAnimationz', 'ArrowToggleSwitch', 'SwitchArrowToggle_', 10, 0);
    this.createAtlasAnimation('switchAnimationz', 'BlueHoldSwitch', 'SwitchBlueHold_', 10, 0);
    this.createAtlasAnimation('switchAnimationz', 'BlueToggleSwitch', 'SwitchBlueToggle_', 10, 0);
  }

  // -------------------------------------------------------

  createAllPickupAnimations(): void {
    this.createPickupAnimation('pickupz', 'clubPickup', 'toolClub_');
    this.createPickupAnimation('pickupz', 'gauntletzPickup', 'toolGauntletz_');
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
   * Creates an animation from the texture atlas identified by the atlasKey parameter.
   *
   * @param {string} atlasKey - The key of the texture atlas as specified when loaded
   * inside the preload method
   * @param {string} animKey - The key by which the animation should be referred
   * to hereafter
   * @param {string} animPrefix - The prefix of the animation as found inside the
   * descriptor file of the texture atlas
   */
  private createAtlasAnimation(atlasKey: string, animKey: string, animPrefix: string, rate: number, repeat: number): void {
    this.stage.anims.create({
      key: animKey,
      repeat: repeat,
      frameRate: rate,
      frames: this.stage.anims.generateFrameNames(atlasKey, {
        prefix: animPrefix,
        start: 1,
        end: this.findFrameCount(this.stage.textures.get(atlasKey), animPrefix),
        zeroPad: 2,
      }),
    });
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
  private findFrameCount(atlas: Texture, animPrefix: string): number {
    let count = 0;

    atlas.getFrameNames().forEach((frameName) => {
      if (frameName.startsWith(animPrefix)) {
        count++;
      }
    });

    return count;
  }
}
