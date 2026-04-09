// 

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

// Scoring Multipliers
let baseScore = 1;
let scoreX;
let scoreY;
let combo = 0;

let perfMax;
let perfMin;
let awesMax;
let awesMin;
let greatMax;
let greatMin;
let goodMax;
let goodMin;
let scoreDis;

//scoreboard
let scoreboard;
let stringys = [];

let timeOffset;
// game states
let gameState = "idle";

let redColorVel = 1;
let greenColorVel = 1;
let blueColorVel = 1;


// squishies
let squishies = [];
let squishSpawned = false;
let test = 2;


class Scoreboard {
  constructor(){
    this.score = 0;
    this.posX = scoreX;
    this.posY = scoreY;
  }
  
  render(){
    push();
    textAlign(CENTER);
    textSize(25);
    fill(255);
    stroke(0);
    strokeWeight(2);
    text(this.score, this.posX, this.posY);
    pop();
  }
  
  update(s){
    this.score += s;
  }
  
  checkScore(note){
    if (note.yPos <= perfMin && note.yPos >= perfMax){
      baseScore = 5;
      combo += 5;
    }
    else if (note.yPos <= awesMin && note.yPos >= awesMax){
      baseScore = 4;
      combo += 4;
    }  
    else if (note.yPos <= greatMin && note.yPos >= greatMax){
      baseScore = 3;
      combo += 3;
    }
    else if (note.yPos <= goodMin && note.yPos >= goodMax){
      baseScore = 2;
      combo += 2;
    } else{
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
    if (t == 1){
      this.xPos = firstNPos;
    }
    else if (t == 2){
      this.xPos = secondNPos;
    }
    else if (t == 3){
      this.xPos = thirdNPos;
    }
    else if (t == 4){
      this.xPos = fourthNPos;
    }
    
  }

  render(){
    if (this.type == 1){
      push();
      translate(this.xPos, this.yPos);
      rotate(radians(90));
      image(leftArrow, 0, 0, scaleX, scaleY);
      pop();
    }
    else if (this.type == 2){
      push();
      translate(this.xPos, this.yPos);
      image(downArrow, 0, 0, scaleX, scaleY);
      pop();
    }
    else if (this.type == 3){
      push();
      translate(this.xPos, this.yPos);
      rotate(radians(180));
      image(upArrow, 0, 0, scaleX, scaleY);
      pop();
    }
    else if (this.type == 4){
      push();
      translate(this.xPos, this.yPos);
      rotate(radians(270));
      image(rightArrow, 0, 0, scaleX, scaleY);
      pop();
    }
    
  }

  move(){
    this.yPos += this.speed;
  }
  
  

  
}

class PopUp {
  constructor(t, n){
    if (t == 0){
      this.stringy = "Missed!";
    }
    else if (t == 2){
      this.stringy = "Good!";
    }
    else if (t == 3){
      this.stringy = "Great!";
    }
    else if (t == 4){
      this.stringy = "Awesome!";
    }
    else if (t == 5){
      this.stringy = "Perfect!"
    }
    
    this.x = n.xPos;
    this.y = n.yPos;
    if (this.x <= width / 2){
      this.rotation = -45;
    }
    else if (this.x > width / 2){
      this.rotation = 45;
    }
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
    if (h == 1) {
      this.xVel = 1;
      this.yVel = 1;
    }
    else if (h == 2){
      this.xVel = -1;
      this.yVel = 1;
    }
    
    this.circles = 5;
    this.red = r;
    this.blue = b;
    this.green = g;
  }

  render(){
    push();
    translate(this.xPos, this.yPos);
    rotate(radians(this.rotation));
    squishyThree(0, 0, this.circles, 50, this.red, this.green, this.blue);
    pop();
  }

  bounce(){
    if (this.xPos <= 0 || this.xPos >= width){
      this.xVel *= -1;
    }
    if (this.yPos <= 0 || this.yPos >= height){
      this.yVel *= -1;
    }
  }
  
  update(){
    this.xPos += this.xVel;
    this.yPos += this.yVel;
    this.bounce();
    this.rotation++;
    this.colorChange();
    if (this.xVel >= 0){
      this.xVel = map(combo, 0, 500, 1, 10);
    }
    else if (this.xVel < 0){
      this.xVel = -1 * map(combo, 0, 500, 1, 10);
    }
    if (this.yVel >= 0){
      this.yVel = map(combo, 0, 500, 1, 10);
    }
    else if (this.yVel < 0){
      this.yVel = -1 * map(combo, 0, 500, 1, 10);
    }
    this.rotation += map(combo, 0, 800, 1, 10);


  }

  colorChange(){
    this.red += map(redColorVel, 0, 400, 0, 255);
    this.blue += map(blueColorVel, 0, 400, 0, 255);
    this.green += map(greenColorVel, 0, 400, 0, 255);
    if (this.red >= 240 || this.red <= 5){
      redColorVel *= -1;
    }
    if (this.green >= 200 || this.green <= 30){
      greenColorVel *= -1;
    }
    if (this.blue >= 220 || this.red <= 70){
      blueColorVel *= -1;
    }
  }


}

function preload() {
  downArrow = loadImage("downArrow.png");
  rightArrow = loadImage("downArrow.png");
  upArrow = loadImage("downArrow.png");
  leftArrow = loadImage("downArrow.png");
  song = loadSound("HoldOnTilMay.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnY = - (height * 0.25);
  // downYPos.push(spawnY);
  // downCount++;
  // rightYPos.push(spawnY);
  // rightCount++;
  // leftYPos.push(spawnY);
  // leftCount++;
  // upYPos.push(spawnY);
  // upCount++;
  scaleX = 50;
  scaleY = 50;
  vel = height/90;
  imageMode(CENTER);
  frameRate(60);
  arrowFrames = [13.177, 13.602, 14.266, 14.898, 16.483, 16.869, 17.301, 17.738, 18.153, 18.966, 20.662, 21.081, 21.3, 21.514, 21.95, 22.413, 22.758, 23.23, 23.597, 24.013, 24.412, 24.836, 26.853, 27.409, 28.024, 29.205, 29.618, 30.053, 30.677, 31.263, 32.511, 32.896, 33.291, 33.698, 34.131, 34.571, 35.362, 35.77, 36.177, 36.571, 37.433, 37.689, 37.905, 38.111, 38.465, 39.036, 39.568, 40.542, 40.92, 41.276, 41.644, 42.018, 42.431, 42.823, 43.747, 44.13, 44.542, 44.91, 45.325, 45.73, 46.098, 46.972, 47.348, 47.753, 48.141, 48.576, 48.99, 49.399, 50.254, 50.665, 51.075, 51.488, 52.071, 52.616, 53.221, 53.419, 53.628, 53.874, 54.079, 54.294, 54.544, 54.743, 55.308, 55.944, 56.937, 57.329, 57.68, 58.07, 58.443, 58.806, 59.153, 60.094, 60.485, 60.905, 61.321, 61.684, 62.037, 62.474, 76.624, 76.845, 77.241, 77.613, 78.45, 78.922, 79.278, 79.382, 79.882, 80.205, 80.414, 80.477, 81.29, 81.761, 81.876, 81.985, 82.183, 82.412, 82.623, 82.735, 83.178, 83.378, 83.689, 84.102, 84.398, 85.001, 85.322, 85.542, 85.769, 85.984, 86.095, 86.299, 86.703, 86.807, 87.179, 87.893, 88.321, 88.421, 88.527, 88.947, 89.058, 89.375, 89.575, 89.785, 89.898, 90.199, 90.564, 91.031, 91.894, 92.778, 93.309, 93.413, 93.75, 94.253, 95.732, 95.931, 96.279, 96.591, 97.04, 97.41, 98.768, 98.871, 99.083, 99.944, 100.263, 100.544, 100.725, 101.013, 101.36, 101.621, 101.847, 102.342, 102.742, 103.157, 103.373, 103.579, 103.933, 104.504, 105.036, 106.01, 106.388, 106.744, 107.112, 107.486, 107.899, 108.291, 109.215, 109.598, 110.01, 110.378, 110.793, 111.198, 111.566, 112.44, 112.816, 113.221, 113.609, 114.044, 114.458, 114.867, 115.722, 116.133, 116.543, 116.956, 117.539, 118.084, 118.689, 118.887, 119.096, 119.342, 119.547, 119.762, 120.012, 120.211, 120.776, 121.412, 122.405, 122.797, 123.148, 123.538, 123.911, 124.274, 124.621, 125.562, 125.953, 126.373, 126.789, 127.152, 127.505, 127.942, 131.468, 131.992, 132.732, 133.461, 134.306, 135.094, 135.955, 136.609, 136.825, 141.754, 142.19, 142.821, 143.436, 144.207, 144.64, 144.946, 145.379, 146.001, 146.294, 146.608, 147.203, 147.513, 148.674, 149.188, 149.636, 149.967, 150.486, 151.228, 155.776, 156.133, 156.495, 157.841, 158.244, 158.942, 159.901, 160.731, 161.601, 162.252, 162.997, 164.588, 165.166, 165.467, 165.754, 166.161, 166.637, 166.841, 168.035, 168.391, 169.113, 169.717, 170.494, 170.94, 171.342, 172.067, 172.484, 172.927, 173.302, 173.927, 174.154, 174.564, 175.015, 175.648, 175.742, 176.25, 176.648, 177.317, 177.9, 178.805, 179.144, 179.517, 179.978, 180.669, 208.195, 208.645, 208.979, 209.365, 209.889, 210.499, 211.353, 211.921, 212.233, 212.629, 213.122, 213.463, 213.871, 214.848, 215.128, 215.512, 215.912, 216.31, 216.698, 217.177, 217.945, 218.469, 218.76, 219.158, 219.673, 220.007, 220.431, 221.252, 221.735, 222.043, 222.489, 223.074, 223.638, 224.338, 224.556, 224.756, 224.957, 225.168, 225.386, 225.588, 225.799, 226.361, 226.994, 227.825, 228.25, 228.667, 229.051, 229.547, 229.94, 230.314, 231.605, 231.89, 232.406, 232.723, 233.205, 233.581];
  arrowTypes = [3, 3, 1, 2, 1, 1, 1, 3, 4, 1, 4, 1, 1, 4, 4, 4, 4, 4, 3, 3, 3, 2, 3, 1, 1, 2, 2, 1, 4, 1, 2, 2, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 3, 2, 4, 2, 4, 3, 4, 4, 1, 4, 3, 1, 3, 4, 1, 2, 2, 4, 1, 2, 3, 2, 1, 3, 4, 3, 4, 1, 2, 3, 2, 2, 1, 3, 1, 2, 3, 1, 3, 4, 2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 3, 4, 4, 4, 3, 3, 4, 1, 1, 4, 2, 2, 4, 1, 1, 2, 4, 3, 1, 1, 3, 1, 2, 2, 3, 2, 3, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 3, 3, 3, 2, 3, 1, 4, 2, 2, 3, 3, 4, 4, 2, 2, 3, 1, 3, 3, 3, 1, 1, 4, 3, 4, 4, 2, 2, 4, 2, 3, 4, 3, 4, 1, 1, 1, 4, 1, 2, 1, 3, 2, 2, 1, 1, 1, 3, 4, 3, 2, 4, 4, 1, 1, 1, 3, 1, 4, 4, 4, 2, 4, 4, 1, 4, 2, 1, 2, 4, 3, 3, 1, 3, 2, 3, 3, 3, 1, 3, 2, 4, 1, 1, 1, 1, 1, 4, 2, 2, 1, 3, 4, 3, 2, 1, 2, 2, 3, 4, 2, 3, 2, 1, 2, 4, 4, 1, 1, 3, 4, 4, 1, 2, 4, 4, 3, 4, 4, 3, 2, 1, 2, 1, 2, 3, 3, 3, 4, 3, 4, 2, 4, 2, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 4, 1, 2, 1, 4, 3, 2, 3, 3, 2, 4, 2, 1, 2, 3, 2, 4, 3, 2, 1, 1, 2, 1, 4, 1, 2, 1, 4, 2, 2, 3, 3, 4, 2, 4, 4, 2, 4, 1, 1, 4, 3, 1, 2, 4, 3, 3, 4, 1, 1, 4, 1, 1, 3, 1, 3, 1, 4, 3, 3, 3, 1, 3, 4, 3, 2, 1, 3, 3, 4, 4, 4, 2, 4, 1, 3, 3, 4, 3, 1, 4];
  song.play();
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
  scoreX = width/2;
  scoreY = height * 0.1;
  scoreboard = new Scoreboard();
  tempSquishy = new Squishy(width/2, height/2, 50, 100, 150, 1);
  squishies.push(tempSquishy);
}

function draw() {
  if (gameState == "play"){
    play();
  }
  else if (gameState == "idle"){
    idle();
    if (keyIsPressed === true){
      if (key === 's' || key === 'S'){
        gameState = "play";
        timeOffset = millis() / 1000;
        //millis() = 0;
      }
    }
  }
}

function keyPressed() {
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
  }
  else if (key == 'b'){
    let tempSquishy = new Squishy(squishies[0].xPos, squishies[0].yPos, squishies[0].red, squishies[0].green, squishies[0].blue, 2);
    squishies.push(tempSquishy);
  }
}

function idle(){
  background(10);
  push();
  textAlign(CENTER);
  fill(200);
  stroke(0);
  textSize(20);
  text("Press S to start!", width / 2, height / 2);
  pop();
}

function play(){
  let r = map(750 - combo, 0, 750, 0, 255);
  let b = map(combo, 0, 750, 0, 255);
  let g = map(combo, 0, 300, 0, 255);

  background(r, g, b);
  for (let i = 0; i < squishies.length; i++){
    squishies[i].render();
    squishies[i].update();
  }
  text("D", width * 0.2, height * 0.85);
  text("F", width * 0.4, height * 0.85);
  text("H", width * 0.6, height * 0.85);
  text("J", width * 0.8, height * 0.85);
  //text(squishies.length, width/2, height/3)
  let currentSec = (millis() / 1000) - timeOffset;
  text(currentSec, width /2, height/2);
  //console.log(currentSec);
  firstArrow.render();
  secondArrow.render();
  thirdArrow.render();
  fourthArrow.render();

  if (arrowFrames.length > 0){
    if (currentSec >= arrowFrames[0]) {
      if (arrowTypes[0] == 1) {
        spawnLeft();
        arrowFrames.splice(0, 1);
        arrowTypes.splice(0, 1);
      } else if (arrowTypes[0] == 2) {
        spawnDown();
        arrowFrames.splice(0, 1);
        arrowTypes.splice(0, 1);
      } else if (arrowTypes[0] == 3) {
        spawnUp();
        arrowFrames.splice(0, 1);
        arrowTypes.splice(0, 1);
      } else if (arrowTypes[0] == 4) {
        spawnRight();
        arrowFrames.splice(0, 1);
        arrowTypes.splice(0, 1);
      }
    }
  }
  if (arrowCount > 0){
    for (let i = 0; i < arrowCount; i++){
      arrows[i].render();
      arrows[i].move();
    }
  }
  scoreboard.render();

  //renderScoreLines();
  if (stringys.length > 0){
    for (let i = 0; i < stringys.length; i++){
      stringys[i].render();
      stringys[i].update();
      if (stringys[i].transparancy <= 0){
        stringys.splice(i, 1);
      }
    }
  }

  spawnSquishy();
}

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
  console.log("arrow spawned");

}

function spawnRand() {
  let r = random(0, 4);
  r = floor(r);
  if (r == 0) {
    spawnUp();
  } else if (r == 1) {
    spawnDown();
  } else if (r == 2) {
    spawnRight();
  } else if (r == 3) {
    spawnLeft();
  }
}

function spawnSquishy(){
  if (scoreboard.score % 20 == 0 && scoreboard.score > 20 && !squishSpawned){
    let tempSquishy = new Squishy(squishies[0].xPos, squishies[0].yPos, squishies[0].red, squishies[0].green, squishies[0].blue, 2);
    squishies.push(tempSquishy);
    squishSpawned == true;
  }
  if (scoreboard.score % 20 != 0){
    squishSpawned == false;
  }
}

function renderScoreLines(){
  push()
  strokeWeight(0.5);
  fill(234, 0, 0);
  stroke(234, 0, 0);
  line(0, perfMax, width, perfMax);
  line(0, perfMin, width, perfMin);
  line(0, awesMax, width, awesMax);
  line(0, awesMin, width, awesMin);
  line(0, greatMax, width, greatMax);
  line(0, greatMin, width, greatMin);
  line(0, goodMax, width, goodMax);
  line(0, goodMin, width, goodMin);
  pop();
}

function squishyThree(x, y, circNum, rad, r, g, b) {
  push();
  translate(x, y);
  noStroke();
  for (i = 0; i < circNum; i++) {
    fill(r, g, b);
    circle(0, 0 - rad, rad * 1.35);
    rotate(radians(360 / circNum));
  }
  push();
  //colorMode(HSB, 100);
  fill(r, g, b);
  circle(0, 0, rad);
  pop();
  pop();
}