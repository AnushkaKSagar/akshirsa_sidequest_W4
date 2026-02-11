/*
BlobPlayer.js (Example 5)

BlobPlayer owns all "dynamic" player state:
- position (x,y), radius (r)
- velocity (vx,vy)
- movement tuning (accel, friction, max run)
- jump state (onGround)
- blob rendering animation parameters (noise wobble)

It also implements:
- update() for physics + collision against platforms
- jump() for input
- draw() for the "breathing blob" look

The algorithm is the same as the original blob world example from Week 2: 
- Apply input acceleration
- Apply friction
- Apply gravity
- Compute an AABB (box) around the blob
- Move box in X and resolve collisions
- Move box in Y and resolve collisions
- Write back box center to blob position
*/

class BlobPlayer {
  constructor() {
    // ----- Transform -----
    this.x = 0;
    this.y = 0;
    this.r = 26;
 
    // ----- Velocity -----
    this.vx = 0;
    this.vy = 0;
 
    // ----- Movement tuning -----
    this.accel = 0.55;
    this.maxRun = 4.0;
 
    this.gravity = 0.65;
    this.jumpV = -11.0;
 
    this.onGround = false;
 
    this.frictionAir = 0.995;
    this.frictionGround = 0.88;
 
    // ----- Animation -----
    this.t = 0;
    this.tSpeed = 0.01;
 
    this.spikeCount = 15;
    this.spikeHeight = 18;
 
    this.isJumping = false;
  }
 
  spawnFromLevel(level) {
    this.gravity = level.gravity;
    this.jumpV = level.jumpV;
 
    this.x = level.start.x;
    this.y = level.start.y;
    this.r = level.start.r;
 
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.isJumping = false;
  }
 
  update(platforms) {
 
    let move = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) move -= 1;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) move += 1;
 
    this.vx += this.accel * move;
 
    this.vx *= this.onGround ? this.frictionGround : this.frictionAir;
    this.vx = constrain(this.vx, -this.maxRun, this.maxRun);
 
    this.vy += this.gravity;
 
    let box = {
      x: this.x - this.r,
      y: this.y - this.r,
      w: this.r * 2,
      h: this.r * 2
    };
 
    // --- X movement ---
    box.x += this.vx;
 
    for (const s of platforms) {
      if (overlapAABB(box, s)) {
 
        if (this.vx > 0) box.x = s.x - box.w;
        else if (this.vx < 0) box.x = s.x + s.w;
 
        this.vx = 0;
      }
    }
 
    // --- Y movement ---
    box.y += this.vy;
    this.onGround = false;
 
    for (const s of platforms) {
      if (overlapAABB(box, s)) {
 
        if (this.vy > 0) {
          box.y = s.y - box.h;
          this.vy = 0;
          this.onGround = true;
          this.isJumping = false;
        }
 
        else if (this.vy < 0) {
          box.y = s.y + s.h;
          this.vy = 0;
        }
      }
    }
 
    this.x = box.x + box.w / 2;
    this.y = box.y + box.h / 2;
 
    this.x = constrain(this.x, this.r, width - this.r);
 
    this.t += this.tSpeed;
  }
 
  jump() {
    if (!this.onGround) return;
 
    this.vy = this.jumpV;
    this.onGround = false;
    this.isJumping = true;
  }
 
  draw(colourHex) {
 
    fill(color(colourHex));
    beginShape();
 
    let totalPoints = this.spikeCount * 2;
 
    for (let i = 0; i < totalPoints; i++) {
 
      let angle = (i / totalPoints) * TAU;
 
      let radius = this.r;
 
      if (i % 2 === 0) {
        radius += this.spikeHeight;
      }
 
      let wobble = map(
        noise(cos(angle) + 10, sin(angle) + 10, this.t),
        0,
        1,
        -3,
        3
      );
 
      let finalRadius = radius + wobble;
 
      let px = this.x + cos(angle) * finalRadius;
      let py = this.y + sin(angle) * finalRadius;
 
      vertex(px, py);
    }
 
    endShape(CLOSE);
 
    this.drawFace();
  }
 
  // ⭐ FACE EXPRESSION FUNCTION
  drawFace() {
 
    fill(0);
 
    // Eyes
    circle(this.x - this.r * 0.35, this.y - this.r * 0.2, this.r * 0.18);
    circle(this.x + this.r * 0.35, this.y - this.r * 0.2, this.r * 0.18);
 
    noFill();
    stroke(0);
    strokeWeight(2);
 
    if (this.isJumping) {
 
      // BIG smile
      arc(
        this.x,
        this.y + this.r * 0.2,
        this.r * 1.1,
        this.r * 0.9,
        0,
        PI
      );
 
    } else if (this.onGround) {
 
      // small smile
      arc(
        this.x,
        this.y + this.r * 0.25,
        this.r * 0.6,
        this.r * 0.4,
        0,
        PI
      );
    }
 
    noStroke();
  }
}
 
// ⭐ Collision helper
function overlapAABB(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}