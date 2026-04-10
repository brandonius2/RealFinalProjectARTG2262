//start and end screen 
let logo;
let highScore = 0;
let isNewHighScore = false;
let blinkTimer = 0;
let glowPulse = 0;
let cornerSize = 0;
let dots = [];
let arrowsHeld = [false, false, false, false];
let chaosLevel = 0;
let chaosTimer = 0;
let screenShake = 0;
let fakeChats = [];
let brainrotWords = [];


//chat messages
let chatMessages = [
  "omg this game goes hard",
  "W game fr fr",
  "no way bro is playing this",
  "SKIBIDI",
  "chat is this real",
  "💀💀💀",
  "bro fell off",
  "this is actually insane",
  "no cap this slaps",
  "KEKW",
  "who made this lmao",
  "GIGACHAD game",
  "i cant focus lol",
  "POV: losing ur mind",
  "🔥🔥🔥",
  "rizz level: MAX",
];

let brainrotList = [
  "SKIBIDI", "RIZZ", "NO CAP", "BASED",
  "GIGACHAD", "BUSSIN", "FR FR", "SLAY",
  "SHEESH", "YEET", "RATIO", "W",
  "SIGMA", "OHIO", "DELULU", "TOUCH GRASS"
];

//game
let arrowFrames;
let arrowTypes;
let downArrow;
let rightArrow;
let upArrow;
let leftArrow;
let arrows = [];
let spawnY;
let scaleX;
let scaleY;
let vel;
let firstNPos;
let secondNPos;
let thirdNPos;
let fourthNPos;
let firstArrow;
let secondArrow;
let thirdArrow;
let fourthArrow;
let arrowCount = 0;
let baseScore = 1;
let scoreX;
let scoreY;
let combo = 0;
let test2 = 1;
let test3;

// hitbox maxes and mins, all maxes are represented on top of the note, while mins are below notes,
// meaning the "maxes" are lower y-values than the mins
let perfMax; //perfect hitbox max (from the top)
let perfMin; //perfect hitboc min (from the bottom)
let awesMax;
let awesMin;
let greatMax;
let greatMin;
let goodMax;
let goodMin;
let scoreDis; //distance between hitboxes

//scoreboard variables
let scoreboard;
let stringys = []; //list of stringy objects that pop on screen whenever a note is hit
let timeOffset; //time offset (in milliseconds) between time when program started running and when actual game started


// color variables of squishies
let redColorVel = 1; 
let greenColorVel = 1;
let blueColorVel = 1;

// list of squishie objects in playscene
let squishies = [];
let squishSpawned = false; //checks if a squishie has been spawned in an amount of time

// song variables
let song;
// gamestate variable
let gameState = "start";
let titleState = "start";



// album covers for selection screen
let ptvCover;

//game classes
// scoreboard object, controls the ui of the scoreboard in game, along with checking if the score of a hit note
class Scoreboard {
  constructor(){ //scoreboard constructor
    this.score = 0; // player score
    this.posX = scoreX; //x position of score
    this.posY = scoreY; //y position of score
  }

  render(){ //renders scoreboard
    push();
    textAlign(CENTER);
    textSize(25);
    fill(255);
    stroke(0);
    strokeWeight(2);
    text(this.score, this.posX, this.posY); //shows score
    pop();
  }

  update(s){ //updates the score with a given s
    this.score += s;
  }

  checkScore(note){ //checks the position of a hit note and gives a score based off of position
    if (note.yPos <= perfMin && note.yPos >= perfMax){ //perfect note
      baseScore = 5; //changes "basescore", which is a variable used to update the score when this function is called
      combo += 5; //updates combo, which impacts the background elements that get more hectic as player does better
    }
    else if (note.yPos <= awesMin && note.yPos >= awesMax){ //awesome note
      baseScore = 4;
      combo += 4;
    }
    else if (note.yPos <= greatMin && note.yPos >= greatMax){ //great note
      baseScore = 3;
      combo += 3;
    }
    else if (note.yPos <= goodMin && note.yPos >= goodMax){ //good note
      baseScore = 2;
      combo += 2;
    } 
    else {
      baseScore = 0;
      combo -= 5;
    }
  }
}

class Note {
  constructor(t, y){
    this.type = t;
    this.yPos = y;
    this.speed = vel;
    if (t == 1) this.xPos = firstNPos;
    else if (t == 2) this.xPos = secondNPos;
    else if (t == 3) this.xPos = thirdNPos;
    else if (t == 4) this.xPos = fourthNPos;
  }

 /* render(){
    if (this.type == 1){
      push();
      translate(this.xPos, this.yPos);
      rotate(radians(90));
      image(leftArrow, 0, 0, scaleX, scaleY);
      pop();
    } else if (this.type == 2){
      push();
      translate(this.xPos, this.yPos);
      image(downArrow, 0, 0, scaleX, scaleY);
      pop();
    } else if (this.type == 3){
      push();
      translate(this.xPos, this.yPos);
      rotate(radians(180));
      image(upArrow, 0, 0, scaleX, scaleY);
      pop();
    } else if (this.type == 4){
      push();
      translate(this.xPos, this.yPos);
      rotate(radians(270));
      image(rightArrow, 0, 0, scaleX, scaleY);
      pop();
    }
  } */
  
  render(){
  push();
  imageMode(CENTER);
  if (this.type == 1){
    // D key 
    image(leftArrow, this.xPos, this.yPos, scaleX, scaleY);
  } else if (this.type == 2){
    // F key 
    image(downArrow, this.xPos, this.yPos, scaleX, scaleY);
  } else if (this.type == 3){
    // H key 
    push();
    translate(this.xPos, this.yPos);
    rotate(radians(180));
    image(upArrow, 0, 0, scaleX, scaleY);
    pop();
  } else if (this.type == 4){
    // J key 
    push();
    translate(this.xPos, this.yPos);
    rotate(radians(180));
    image(rightArrow, 0, 0, scaleX, scaleY);
    pop();
  }
  imageMode(CORNER);
  pop();
}

  move(){
    this.yPos += this.speed;
  }
}

class PopUp {
  constructor(t, n){
    if (t == 0) this.stringy = "Missed!";
    else if (t == 2) this.stringy = "Good!";
    else if (t == 3) this.stringy = "Great!";
    else if (t == 4) this.stringy = "Awesome!";
    else if (t == 5) this.stringy = "Perfect!";
    this.x = n.xPos;
    this.y = n.yPos;
    this.rotation = (this.x <= width / 2) ? -45 : 45;
    this.transparancy = 250;
  }

  render(){
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    textAlign(CENTER);
    textSize(15);
    fill(230, this.transparancy);
    stroke(0, this.transparancy);
    text(this.stringy, 0, 0);
    pop();
  }

  update(){
    this.x -= 1;
    this.y -= 1;
    this.transparancy -= 5;
  }
}

class Squishy {
  constructor(x, y, r, g, b, h){
    this.xPos = x;
    this.yPos = y;
    this.rotation = 1;
    if (h == 1){ this.xVel = 1; this.yVel = 1; }
    else if (h == 2){ this.xVel = -1; this.yVel = 1; }
    this.circles = 5;
    this.red = r;
    this.b = b;  // renamed from this.blue
    this.green = g;
  }

  render(){
    push();
    translate(this.xPos, this.yPos);
    rotate(radians(this.rotation));
    squishyThree(0, 0, this.circles, 50, this.red, this.green, this.b);
    pop();
  }

  bounce(){
    if (this.xPos <= 0 || this.xPos >= width) this.xVel *= -1;
    if (this.yPos <= 0 || this.yPos >= height) this.yVel *= -1;
  }

  update(){
    this.xPos += this.xVel;
    this.yPos += this.yVel;
    this.bounce();
    this.rotation++;
    this.colorChange();
    this.xVel = (this.xVel >= 0) ? map(combo, 0, 500, 1, 10) : -1 * map(combo, 0, 500, 1, 10);
    this.yVel = (this.yVel >= 0) ? map(combo, 0, 500, 1, 10) : -1 * map(combo, 0, 500, 1, 10);
    this.rotation += map(combo, 0, 800, 1, 10);
  }

  colorChange(){
    this.red += map(redColorVel, 0, 400, 0, 255);
    this.b += map(blueColorVel, 0, 400, 0, 255);
    this.green += map(greenColorVel, 0, 400, 0, 255);
    if (this.red >= 240 || this.red <= 5) redColorVel *= -1;
    if (this.green >= 200 || this.green <= 30) greenColorVel *= -1;
    if (this.b >= 220 || this.red <= 70) blueColorVel *= -1;
  }
}

//preload
function preload() {
  logo = loadImage("logo.png");
  downArrow = loadImage("downArrow.png");
  rightArrow = loadImage("downArrow.png");
  upArrow = loadImage("downArrow.png");
  leftArrow = loadImage("downArrow.png");
  song = loadSound("HoldOnTilMay.mp3");
  ptvCover = loadImage("PTVCollideWithSky.jpg");
}

//setup
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.setAttribute("tabindex", "0");
  canvas.elt.focus();
  drawingContext.imageSmoothingEnabled = false;
  frameRate(60);

  //dots in bg
  for (let i = 0; i < 60; i++) {
    dots.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.2, 0.8),
      opacity: random(80, 180),
      col: random([
        [0, 200, 220],
        [255, 0, 144],
        [123, 0, 212]
      ])
    });
  }
  initChats();

// Brandons game setup
  spawnY = -(height * 0.25);
  scaleX = 50;
  scaleY = 50;
  vel = height / 90;
  arrowFrames = [13.177, 13.602, 14.266, 14.898, 16.483, 16.869, 17.301, 17.738, 18.153, 18.966, 20.662, 21.081, 21.3, 21.514, 21.95, 22.413, 22.758, 23.23, 23.597, 24.013, 24.412, 24.836, 26.853, 27.409, 28.024, 29.205, 29.618, 30.053, 30.677, 31.263, 32.511, 32.896, 33.291, 33.698, 34.131, 34.571, 35.362, 35.77, 36.177, 36.571, 37.433, 37.689, 37.905, 38.111, 38.465, 39.036, 39.568, 40.542, 40.92, 41.276, 41.644, 42.018, 42.431, 42.823, 43.747, 44.13, 44.542, 44.91, 45.325, 45.73, 46.098, 46.972, 47.348, 47.753, 48.141, 48.576, 48.99, 49.399, 50.254, 50.665, 51.075, 51.488, 52.071, 52.616, 53.221, 53.419, 53.628, 53.874, 54.079, 54.294, 54.544, 54.743, 55.308, 55.944, 56.937, 57.329, 57.68, 58.07, 58.443, 58.806, 59.153, 60.094, 60.485, 60.905, 61.321, 61.684, 62.037, 62.474, 76.624, 76.845, 77.241, 77.613, 78.45, 78.922, 79.278, 79.382, 79.882, 80.205, 80.414, 80.477, 81.29, 81.761, 81.876, 81.985, 82.183, 82.412, 82.623, 82.735, 83.178, 83.378, 83.689, 84.102, 84.398, 85.001, 85.322, 85.542, 85.769, 85.984, 86.095, 86.299, 86.703, 86.807, 87.179, 87.893, 88.321, 88.421, 88.527, 88.947, 89.058, 89.375, 89.575, 89.785, 89.898, 90.199, 90.564, 91.031, 91.894, 92.778, 93.309, 93.413, 93.75, 94.253, 95.732, 95.931, 96.279, 96.591, 97.04, 97.41, 98.768, 98.871, 99.083, 99.944, 100.263, 100.544, 100.725, 101.013, 101.36, 101.621, 101.847, 102.342, 102.742, 103.157, 103.373, 103.579, 103.933, 104.504, 105.036, 106.01, 106.388, 106.744, 107.112, 107.486, 107.899, 108.291, 109.215, 109.598, 110.01, 110.378, 110.793, 111.198, 111.566, 112.44, 112.816, 113.221, 113.609, 114.044, 114.458, 114.867, 115.722, 116.133, 116.543, 116.956, 117.539, 118.084, 118.689, 118.887, 119.096, 119.342, 119.547, 119.762, 120.012, 120.211, 120.776, 121.412, 122.405, 122.797, 123.148, 123.538, 123.911, 124.274, 124.621, 125.562, 125.953, 126.373, 126.789, 127.152, 127.505, 127.942, 131.468, 131.992, 132.732, 133.461, 134.306, 135.094, 135.955, 136.609, 136.825, 141.754, 142.19, 142.821, 143.436, 144.207, 144.64, 144.946, 145.379, 146.001, 146.294, 146.608, 147.203, 147.513, 148.674, 149.188, 149.636, 149.967, 150.486, 151.228, 155.776, 156.133, 156.495, 157.841, 158.244, 158.942, 159.901, 160.731, 161.601, 162.252, 162.997, 164.588, 165.166, 165.467, 165.754, 166.161, 166.637, 166.841, 168.035, 168.391, 169.113, 169.717, 170.494, 170.94, 171.342, 172.067, 172.484, 172.927, 173.302, 173.927, 174.154, 174.564, 175.015, 175.648, 175.742, 176.25, 176.648, 177.317, 177.9, 178.805, 179.144, 179.517, 179.978, 180.669, 208.195, 208.645, 208.979, 209.365, 209.889, 210.499, 211.353, 211.921, 212.233, 212.629, 213.122, 213.463, 213.871, 214.848, 215.128, 215.512, 215.912, 216.31, 216.698, 217.177, 217.945, 218.469, 218.76, 219.158, 219.673, 220.007, 220.431, 221.252, 221.735, 222.043, 222.489, 223.074, 223.638, 224.338, 224.556, 224.756, 224.957, 225.168, 225.386, 225.588, 225.799, 226.361, 226.994, 227.825, 228.25, 228.667, 229.051, 229.547, 229.94, 230.314, 231.605, 231.89, 232.406, 232.723, 233.205, 233.581];
  arrowTypes = [3, 3, 1, 2, 1, 1, 1, 3, 4, 1, 4, 1, 1, 4, 4, 4, 4, 4, 3, 3, 3, 2, 3, 1, 1, 2, 2, 1, 4, 1, 2, 2, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 3, 2, 4, 2, 4, 3, 4, 4, 1, 4, 3, 1, 3, 4, 1, 2, 2, 4, 1, 2, 3, 2, 1, 3, 4, 3, 4, 1, 2, 3, 2, 2, 1, 3, 1, 2, 3, 1, 3, 4, 2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 3, 4, 4, 4, 3, 3, 4, 1, 1, 4, 2, 2, 4, 1, 1, 2, 4, 3, 1, 1, 3, 1, 2, 2, 3, 2, 3, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 3, 3, 3, 2, 3, 1, 4, 2, 2, 3, 3, 4, 4, 2, 2, 3, 1, 3, 3, 3, 1, 1, 4, 3, 4, 4, 2, 2, 4, 2, 3, 4, 3, 4, 1, 1, 1, 4, 1, 2, 1, 3, 2, 2, 1, 1, 1, 3, 4, 3, 2, 4, 4, 1, 1, 1, 3, 1, 4, 4, 4, 2, 4, 4, 1, 4, 2, 1, 2, 4, 3, 3, 1, 3, 2, 3, 3, 3, 1, 3, 2, 4, 1, 1, 1, 1, 1, 4, 2, 2, 1, 3, 4, 3, 2, 1, 2, 2, 3, 4, 2, 3, 2, 1, 2, 4, 4, 1, 1, 3, 4, 4, 1, 2, 4, 4, 3, 4, 4, 3, 2, 1, 2, 1, 2, 3, 3, 3, 4, 3, 4, 2, 4, 2, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 4, 1, 2, 1, 4, 3, 2, 3, 3, 2, 4, 2, 1, 2, 3, 2, 4, 3, 2, 1, 1, 2, 1, 4, 1, 2, 1, 4, 2, 2, 3, 3, 4, 2, 4, 4, 2, 4, 1, 1, 4, 3, 1, 2, 4, 3, 3, 4, 1, 1, 4, 1, 1, 3, 1, 3, 1, 4, 3, 3, 3, 1, 3, 4, 3, 2, 1, 3, 3, 4, 4, 4, 2, 4, 1, 3, 3, 4, 3, 1, 4];
  firstNPos = width * 0.2;
  secondNPos = width * 0.4;
  thirdNPos = width * 0.6;
  fourthNPos = width * 0.8;
  firstArrow = new Note(1, height * 0.75);
  secondArrow = new Note(2, height * 0.75);
  thirdArrow = new Note(3, height * 0.75);
  fourthArrow = new Note(4, height * 0.75);
  scoreDis = height * 0.01;
  perfMax = (height * 0.75) - scoreDis;
  perfMin = (height * 0.75) + scoreDis;
  awesMax = perfMax - scoreDis;
  awesMin = perfMin + scoreDis;
  greatMax = awesMax - scoreDis;
  greatMin = awesMin + scoreDis;
  goodMax = greatMax - scoreDis;
  goodMin = greatMin + scoreDis;
  scoreX = width / 2;
  scoreY = height * 0.1;
  scoreboard = new Scoreboard();
  let tempSquishy = new Squishy(width / 2, height / 2, 50, 100, 150, 1);
  squishies.push(tempSquishy);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//key handling
function keyPressed() {
  // spacebar starts game from start screen or replays from end screen
  if (keyCode === 32) {
    if (gameState === "start") {
      if (titleState === "start"){
        titleState = "songSelect";
      }
      else {
        gameState = "play";
        song.play();
        timeOffset = millis() / 1000;
      }
      
    } else if (gameState === "end") {
      gameState = "start";
      cornerSize = 0;
    }
  }

  // D F H J key highlighting start screen
  if (keyCode === 68) arrowsHeld[0] = true; // D
  if (keyCode === 70) arrowsHeld[1] = true; // F
  if (keyCode === 72) arrowsHeld[2] = true; // H
  if (keyCode === 74) arrowsHeld[3] = true; // J

  // Brandon's game key handling
  if (gameState === "play") {
    if (key == 'd') {
      if (arrowCount > 0 && arrows[0].type == 1){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'f') {
      if (arrowCount > 0 && arrows[0].type == 2){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'h') {
      if (arrowCount > 0 && arrows[0].type == 3){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'j') {
      if (arrowCount > 0 && arrows[0].type == 4){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'b') {
      let tempSquishy = new Squishy(squishies[0].xPos, squishies[0].yPos, squishies[0].red, squishies[0].green, squishies[0].b, 2);
      squishies.push(tempSquishy);
    }
  }
}

function keyReleased() {
  if (keyCode === 68) arrowsHeld[0] = false; // D
  if (keyCode === 70) arrowsHeld[1] = false; // F
  if (keyCode === 72) arrowsHeld[2] = false; // H
  if (keyCode === 74) arrowsHeld[3] = false; // J
}

function mousePressed() {
  document.querySelector("canvas").focus();
}

//main draw loop
function draw() {
  if (gameState === "start") drawStartScreen();
  else if (gameState === "play") drawGame();
  else if (gameState === "end") drawEndScreen();

  blinkTimer++;

  // check if song finished — switch to end screen
  if (gameState === "play" && song && !song.isPlaying() && timeOffset !== undefined) {
    endGame(scoreboard.score);
  }
}

//START SCREEN
function drawStartScreen() {
  background(0);
  drawDots();

  //aesthetics
  stroke(0, 200, 220, 18);
  strokeWeight(1);
  let gridSize = 60;
  for (let x = 0; x < width; x += gridSize) line(x, 0, x, height);
  for (let y = 0; y < height; y += gridSize) line(0, y, width, y);

  noStroke();
  let pinkWash = drawingContext.createLinearGradient(0, 0, width * 0.5, height);
  pinkWash.addColorStop(0, "rgba(255,0,144,0.07)");
  pinkWash.addColorStop(1, "rgba(0,0,0,0)");
  drawingContext.fillStyle = pinkWash;
  rect(0, 0, width, height);

  let purpleWash = drawingContext.createLinearGradient(width, 0, width * 0.5, height);
  purpleWash.addColorStop(0, "rgba(123,0,212,0.1)");
  purpleWash.addColorStop(1, "rgba(0,0,0,0)");
  drawingContext.fillStyle = purpleWash;
  rect(0, 0, width, height);


  drawCorners(color(0, 200, 220), 40, 40, 3);

  //logo
  if (titleState === "start") {

  
  glowPulse += 0.03;
  let glowSize = sin(glowPulse) * 20 + 40;
  drawingContext.shadowColor = "rgba(255, 255, 255, 0.6)";
  drawingContext.shadowBlur = glowSize;
  let logoW = 420;
  let logoH = logoW * (logo.height / logo.width);
  let logoY = height / 2 - logoH / 2 - 60;
  image(logo, width / 2 - logoW / 2, logoY, logoW, logoH);
  drawingContext.shadowBlur = 0;

  // tagline
  noStroke();
  fill(0, 200, 220);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("// A RHYTHM ASSAULT //", width / 2, logoY + logoH * 0.78);

  drawArrowKeys(width / 2, logoY + logoH * 0.88 + 20);

  // blinking press spacebar to start
  if (floor(blinkTimer / 30) % 2 === 0) {
    fill(255);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("PRESS SPACEBAR TO START", width / 2, logoY + logoH * 0.88 + 80);
  }
}

else if (titleState === "songSelect"){
  songSelection();
}

  // footer
  fill(255, 255, 255, 160);
  textSize(10);
  textStyle(NORMAL);
  textAlign(LEFT);
  text("Brandon Harris & Paulina Valenzuela", 40, height - 20);
  textAlign(CENTER);
  text("USE HEADPHONES", width / 2, height - 20);
  textAlign(RIGHT);
  text("© SMASHING BUTTONS", width - 40, height - 20);
}

// song selection screen
function songSelection(){
  push();
  rectMode(CENTER);
  imageMode(CENTER);
  fill(255, 30);
  rect(width/2, height * 0.3, width * 0.5, height * 0.2);
  image(ptvCover, width * 0.3, height * 0.3, height * 0.17, height * 0.17);
  pop();
}





//GAME///////////////////////////////////////////////
function drawGame() {
  push();
  applyScreenShake();

 // let r = map(750 - combo, 0, 750, 0, 255);
 // let b = map(combo, 0, 750, 0, 255);
 // let g = map(combo, 0, 300, 0, 255);
 // background(r, g, b);
  background (0);

  for (let i = 0; i < squishies.length; i++){
    squishies[i].render();
    squishies[i].update();
  }

  // chaos overlays
  if (chaosLevel >= 2) drawFakeChat();
  spawnBrainrot();
  drawBrainrot();
  if (chaosLevel >= 7 && frameCount % 45 === 0) {
    let flashColors = ["rgba(255,0,144,0.15)", "rgba(0,200,220,0.15)", "rgba(123,0,212,0.15)"];
    drawingContext.fillStyle = random(flashColors);
    noStroke();
    rect(0, 0, width, height);
  }

  // key labels
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text("D", width * 0.2, height * 0.85);
  text("F", width * 0.4, height * 0.85);
  text("H", width * 0.6, height * 0.85);
  text("J", width * 0.8, height * 0.85);

  let currentSec = (millis() / 1000) - timeOffset;

  firstArrow.render();
  secondArrow.render();
  thirdArrow.render();
  fourthArrow.render();

  if (arrowFrames.length > 0){
    if (currentSec >= arrowFrames[0]) {
      if (arrowTypes[0] == 1) { spawnLeft(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
      else if (arrowTypes[0] == 2) { spawnDown(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
      else if (arrowTypes[0] == 3) { spawnUp(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
      else if (arrowTypes[0] == 4) { spawnRight(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
    }
  }

  if (arrowCount > 0){
    for (let i = 0; i < arrowCount; i++){
      arrows[i].render();
      arrows[i].move();
    }
  }

  scoreboard.render();

  if (stringys.length > 0){
    for (let i = 0; i < stringys.length; i++){
      stringys[i].render();
      stringys[i].update();
      if (stringys[i].transparancy <= 0) stringys.splice(i, 1);
    }
  }

  spawnSquishy();
  drawChaosMeter();
  updateChaos();

  pop();
}

//when song ends
function endGame(finalScore) {
  if (finalScore > highScore) {
    highScore = finalScore;
    isNewHighScore = true;
  } else {
    isNewHighScore = false;
  }
  chaosLevel = 0;
  chaosTimer = 0;
  cornerSize = 0;
  gameState = "end";
}

//END SCREEN////////////
function drawEndScreen() {
  background(0);
  drawDots();

  //aesthteics
  stroke(255, 0, 144, 10);
  strokeWeight(1);
  for (let i = -height; i < width + height; i += 20) {
    line(i, 0, i + height, height);
  }

  drawCorners(color(0, 200, 220), 40, 40, 3);

  noStroke();
  textAlign(CENTER, CENTER);

  // song finished label
  fill(0, 200, 220);
  textSize(12);
  textStyle(BOLD);
  text("─────  SONG COMPLETE  ─────", width / 2, height * 0.14);

  // new high score badge
  if (isNewHighScore) {
    fill(255, 0, 144);
    rectMode(CENTER);
    rect(width / 2, height * 0.24, 340, 48, 2);
    rectMode(CORNER);
    fill(0);
    textSize(20);
    textStyle(BOLD);
    text("⚡  NEW HIGH SCORE  ⚡", width / 2, height * 0.24);
  }

  // score label
  fill(255, 255, 255, 100);
  textSize(13);
  textStyle(NORMAL);
  let scoreLabelY = isNewHighScore ? height * 0.36 : height * 0.28;
  text("YOUR SCORE", width / 2, scoreLabelY);

  // big score number
  drawingContext.shadowColor = "rgba(255,0,144,0.5)";
  drawingContext.shadowBlur = 50;
  fill(255);
  textSize(96);
  textStyle(BOLD);
  text(nf(scoreboard.score, 6), width / 2, scoreLabelY + 80);
  drawingContext.shadowBlur = 0;

  // divider
  stroke(123, 0, 212, 120);
  strokeWeight(1);
  line(width * 0.2, height * 0.62, width * 0.8, height * 0.62);
  noStroke();

  // stats — using real game values
  drawStat("BEST\nCOMBO", str(combo),           width * 0.3, height * 0.71);
  drawStat("HITS",        str(scoreboard.score), width * 0.5, height * 0.71);
  drawStat("HIGH\nSCORE", str(highScore),        width * 0.7, height * 0.71);

  // play again button
  fill(255, 0, 144);
  rectMode(CENTER);
  rect(width / 2, height * 0.84, 220, 44, 2);
  rectMode(CORNER);
  fill(0);
  textSize(18);
  textStyle(BOLD);
  text("↺  PLAY AGAIN", width / 2, height * 0.84);

  // spacebar hint
  fill(255, 255, 255, 60);
  textSize(11);
  textStyle(NORMAL);
  text("PRESS SPACEBAR TO PLAY AGAIN", width / 2, height * 0.92);
}

//spawn functions
function spawnLeft() {
  let tempNote = new Note(1, spawnY);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnRight() {
  let tempNote = new Note(4, spawnY);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnUp() {
  let tempNote = new Note(3, spawnY);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnDown() {
  let tempNote = new Note(2, spawnY);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnSquishy(){
  if (scoreboard.score % 20 == 0 && scoreboard.score > 20 && !squishSpawned){
    let tempSquishy = new Squishy(squishies[0].xPos, squishies[0].yPos, squishies[0].red, squishies[0].green, squishies[0].b, 2);
    squishies.push(tempSquishy);
    squishSpawned = true;
  }
  if (scoreboard.score % 20 != 0){
    squishSpawned = false;
  }
}

function squishyThree(x, y, circNum, rad, r, g, b) {
  push();
  translate(x, y);
  noStroke();
  for (let i = 0; i < circNum; i++) {
    fill(r, g, b);
    circle(0, 0 - rad, rad * 1.35);
    rotate(radians(360 / circNum));
  }
  push();
  fill(r, g, b);
  circle(0, 0, rad);
  pop();
  pop();
}

//CHAOS SYSTEM
function updateChaos() {
  chaosTimer++;
  if (chaosTimer % 900 === 0 && chaosLevel < 10) {
    chaosLevel++;
    screenShake = 20;
  }
  screenShake = max(0, screenShake - 0.5);
}

function applyScreenShake() {
  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
  }
}

function initChats() {
  for (let i = 0; i < 8; i++) {
    fakeChats.push({
      msg: random(chatMessages),
      y: random(height),
      opacity: random(150, 255),
      speed: random(0.3, 0.8)
    });
  }
}

function drawFakeChat() {
  textAlign(LEFT, CENTER);
  textSize(12);
  textStyle(NORMAL);
  for (let c of fakeChats) {
    fill(255, 255, 255, c.opacity);
    text(c.msg, 10, c.y);
    c.y -= c.speed;
    if (c.y < 0) {
      c.y = height;
      c.msg = random(chatMessages);
    }
  }
}

function spawnBrainrot() {
  if (chaosLevel >= 3 && frameCount % 120 === 0) {
    brainrotWords.push({
      word: random(brainrotList),
      x: random(width * 0.1, width * 0.9),
      y: height + 20,
      size: random(20, 60),
      speed: random(1, 3),
      col: random([[255,0,144],[0,200,220],[123,0,212],[255,255,255]]),
      opacity: 255
    });
  }
}

function drawBrainrot() {
  for (let i = brainrotWords.length - 1; i >= 0; i--) {
    let w = brainrotWords[i];
    fill(w.col[0], w.col[1], w.col[2], w.opacity);
    noStroke();
    textSize(w.size);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(w.word, w.x, w.y);
    w.y -= w.speed;
    w.opacity -= 1.5;
    if (w.opacity <= 0) brainrotWords.splice(i, 1);
  }
}

function drawChaosMeter() {
  let meterW = 140;
  let meterH = 16;
  let meterX = width - 20 - meterW;
  let meterY = 20;
  noStroke();
  fill(255, 0, 144);
  textSize(10);
  textStyle(BOLD);
  textAlign(RIGHT);
  text("CHAOS LEVEL " + chaosLevel, width - 20, meterY + 4);
  noFill();
  stroke(255, 255, 255, 40);
  strokeWeight(1);
  rect(meterX, meterY + 12, meterW, meterH, 2);
  let r = map(chaosLevel, 0, 10, 0, 255);
  let b = map(chaosLevel, 0, 10, 220, 0);
  fill(r, 0, b, 200);
  noStroke();
  rect(meterX, meterY + 12, meterW * (chaosLevel / 10), meterH, 2);
}

//HELPER FUCTIONS
function drawCorners(col, margin, size, weight) {
  cornerSize = min(cornerSize + 2, size);
  stroke(col);
  strokeWeight(weight);
  noFill();
  line(margin, margin, margin + cornerSize, margin);
  line(margin, margin, margin, margin + cornerSize);
  line(width - margin, margin, width - margin - cornerSize, margin);
  line(width - margin, margin, width - margin, margin + cornerSize);
  line(margin, height - margin, margin + cornerSize, height - margin);
  line(margin, height - margin, margin, height - margin - cornerSize);
  line(width - margin, height - margin, width - margin - cornerSize, height - margin);
  line(width - margin, height - margin, width - margin, height - margin - cornerSize);
  noStroke();
}

function drawArrowKeys(cx, cy) {
  let keys = ["D", "F", "H", "J"];
  let keySize = 34;
  let gap = 8;
  let totalW = keys.length * (keySize + gap) + 30 + 40;
  let startX = cx - totalW / 2;

  textSize(11);
  textStyle(BOLD);
  fill(255, 255, 255, 100);
  textAlign(LEFT, CENTER);
  text("HIT", startX, cy);
  startX += 34;

  for (let i = 0; i < keys.length; i++) {
    let x = startX + i * (keySize + gap);
    if (arrowsHeld[i]) {
      fill(255, 0, 144);
      stroke(255, 0, 144, 200);
      drawingContext.shadowColor = "rgba(255,0,144,0.8)";
      drawingContext.shadowBlur = 20;
    } else {
      noFill();
      stroke(255, 255, 255, 60);
      drawingContext.shadowBlur = 0;
    }
    strokeWeight(1.5);
    rect(x, cy - keySize / 2, keySize, keySize, 4);
    drawingContext.shadowBlur = 0;
    noStroke();
    fill(arrowsHeld[i] ? 0 : 255);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(keys[i], x + keySize / 2, cy);
  }

  startX += keys.length * (keySize + gap) + 6;
  noStroke();
  fill(255, 255, 255, 100);
  textSize(11);
  textAlign(LEFT, CENTER);
  text("TO BEAT", startX, cy);
  textAlign(CENTER, CENTER);
}

function drawDots() {
  noStroke();
  for (let d of dots) {
    fill(d.col[0], d.col[1], d.col[2], d.opacity);
    ellipse(d.x, d.y, d.size);
    d.y -= d.speed;
    if (d.y < 0) {
      d.y = height;
      d.x = random(width);
    }
  }
}

function drawStat(label, val, x, y) {
  fill(255);
  textSize(26);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(val, x, y);
  fill(255, 255, 255, 80);
  textSize(10);
  textStyle(NORMAL);
  text(label, x, y + 28);
}
