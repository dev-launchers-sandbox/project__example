import Phaser from "phaser";
import Character from "./Character.js";

export default class Player extends Character {
  constructor(scene, x, y) {
    super(scene, x, y);

    // Track the arrow keys & OPQA
    const {
      LEFT,
      RIGHT,
      UP,
      Q,
      O,
      P,
      A,
      D,
      W,
      S,
      DOWN
    } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      q: Q,
      o: O,
      p: P,
      a: A,
      d: D,
      w: W,
      s: S,
      down: DOWN
    });

    const anims = scene.anims;
    anims.create({
      key: "baker-idle",
      frames: anims.generateFrameNumbers("baker", { start: 1, end: 1 }),
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: "baker-smash",
      frames: anims.generateFrameNumbers("baker", { start: 2, end: 6 }),
      frameRate: 1,
      repeat: -1
    });
    anims.create({
      key: "baker-walk",
      frames: anims.generateFrameNumbers("bakerWalk", { start: 1, end: 4 }),
      frameRate: 3,
      repeat: -1
    });
  }

  update() {
    const keys = this.keys;
    //const sprite = this;
    const onGround = this.body.blocked.down;
    const cakeOnGround = this.scene.cake.body.blocked.down;
    const acceleration = onGround ? 150 : 150;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      this.setAccelerationX(-acceleration);
      this.setFlipX(true);
    } else if (keys.right.isDown || keys.d.isDown) {
      this.setAccelerationX(acceleration);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown || keys.w.isDown)) {
      this.setVelocityY(-230);
    }
    //key.down is when you press down arrow key and key s is when you press down s key
    /*if (onGround && (keys.down.isDown || keys.s.isDown)) {
      this.anims.play("baker-smash", true);
      this.setVelocityY(220);
    }*/

    if (onGround) {
      if (keys.down.isDown || keys.s.isDown) {
        this.anims.play("baker-smash", true);
        this.setVelocityY(220);
      } else if (this.body.velocity.x !== 0) {
        this.anims.play("baker-idle", true);
      }
    } else {
      this.anims.stop();
      //this.setTexture("baker", 4);
    }

    //checks distance from cake, checks if it's on the right side of the cake, checks if it's equal y from the cake, and if cake and player are onground, and checks for the player's Y velocity
    if (this.distanceAwayFromX(this.scene.cake.x) >= -30) {
      if (this.x > this.scene.cake.x && this.y === this.scene.cake.y) {
        if (onGround && cakeOnGround && this.body.velocity.y === 220) {
          this.scene.cake.setVelocityY(-170);
          this.scene.cake.setVelocityX(-200);
          this.particleSmash();
          this.scene.cameras.main.shake(500, 0.01);
        }
      }
    }
    //checks distance from cake, checks if it's on the left side of the cake, checks if it's equal y from the cake, and if cake and player are onground, and checks for the player's Y velocity
    if (this.distanceAwayFromX(this.scene.cake.x) <= 30) {
      if (this.x < this.scene.cake.x && this.y === this.scene.cake.y) {
        if (onGround && cakeOnGround && this.body.velocity.y === 220) {
          this.scene.cake.setVelocityY(-170);
          this.scene.cake.setVelocityX(200);
          this.particleSmash();
          this.scene.cameras.main.shake(500, 0.01);
        }
      }
    }
  }

  particleSmash() {
    const p = this.scene.add.particles("power");
    const emitter = p.createEmitter({
      x: this.x,
      y: this.y,
      speed: 200,
      lifespan: 100,
      blendMOde: "ADD",
      frequency: 50,
      alpha: { start: 1, end: 0 }
    });

    this.scene.time.delayedCall(200, () => {
      emitter.stop();
    });
  }

  distanceAwayFromX(targetX) {
    var distanceX = this.scene.cake.x - this.x;
    return distanceX;
  }

  playerMoveCake(distance, velocityY, velo) {
    const onGround = this.body.blocked.down;
    const cakeOnGround = this.scene.cake.body.blocked.down;
    const right = this.scene.cake.x - this.x > 0;
    const left = this.scene.cake.x - this.x < 0;

    if (this.distanceAwayFromX(this.scene.cake.x) <= distance) {
      if (this.x < this.scene.cake.x && this.y === this.scene.cake.y) {
        if (onGround && cakeOnGround && this.body.velocity.y === 10000) {
          this.scene.cake.setVelocityY(-170);
          this.scene.cake.setVelocityX(200);
          this.particleSmash();
          this.scene.cameras.main.shake(500, 0.01);
        }
      }
    }
  }

  destroy() {}
}
