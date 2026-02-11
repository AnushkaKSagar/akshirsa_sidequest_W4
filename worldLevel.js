/*
WorldLevel.js (Example 5)

WorldLevel wraps ONE level object from levels.json and provides:
- Theme colours (background/platform/blob)
- Physics parameters that influence the player (gravity, jump velocity)
- Spawn position for the player (start)
- An array of Platform instances
- A couple of helpers to size the canvas to fit the geometry

This is directly inspired by your original blob sketch’s responsibilities: 
- parse JSON
- map platforms array
- apply theme + physics
- infer canvas size

Expected JSON shape for each level (from your provided file): 
{
  "name": "Intro Steps",
  "gravity": 0.65,
  "jumpV": -11.0,
  "theme": { "bg":"...", "platform":"...", "blob":"..." },
  "start": { "x":80, "y":220, "r":26 },
  "platforms": [ {x,y,w,h}, ... ]
}
*/

class WorldLevel {

  constructor(levelData) {
 
    this.name = levelData.name;

    this.gravity = levelData.gravity;

    this.jumpV = levelData.jumpV;

    this.start = levelData.start;

    this.theme = levelData.theme;

    this.goalX = levelData.goalX;
 
    this.platforms = [];
 
    // ✅ LOOP — dynamic platform creation

    for (let p of levelData.platforms) {

      this.platforms.push(new Platform(p));

    }

  }
 
  drawWorld() {

    background(this.theme.bg);
 
    for (let p of this.platforms) {

      p.draw(this.theme.platform);

    }

  }
 
  inferWidth(defaultW) {

    return defaultW;

  }
 
  inferHeight(defaultH) {

    return defaultH;

  }

}