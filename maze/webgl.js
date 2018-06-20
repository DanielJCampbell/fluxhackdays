// MIT License
//
// Copyright (c) 2018 Flux Federation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var globals = {}

function webGLStart(maze) {
  var canvas = document.getElementById("canvas");
  globals.maze = maze;

  initGL(canvas);
  initShaders();
  initBuffers();
  initAnimation();

  globals.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  globals.gl.enable(globals.gl.DEPTH_TEST);

  tick();
}

function tick() {
  requestAnimationFrame(tick);
  drawScene();
  animate();
}

function animate() {
  var timeNow = new Date().getTime();

  if (globals.lastTime != 0) {
    var elapsed = timeNow - globals.lastTime;

    if (globals.speed !== 0) {
      var oldX = globals.cameraX;
      var oldZ = globals.cameraZ;

      globals.cameraX -= Math.sin(degToRad(globals.yaw)) * globals.speed * elapsed;
      globals.cameraZ -= Math.cos(degToRad(globals.yaw)) * globals.speed * elapsed;

      if (!globals.noclip) {
        if (illegalX(oldX)) {
          globals.cameraX = oldX;
        }
        if (illegalZ(oldZ)) {
          globals.cameraZ = oldZ;
        }
      }
    }
    if (globals.vertSpeed !== 0) {
      var oldY = globals.cameraY;
      globals.cameraY += globals.vertSpeed * elapsed;

      if (!globals.noclip && illegalY(oldY)) {
        globals.cameraY = oldY;
      }
    }
    globals.yaw += globals.yawRate * elapsed;
    globals.pitch += globals.pitchRate * elapsed;
  }
  globals.lastTime = timeNow;
}

function mazePos(position) {
  return [
    Math.floor((position[0] + 1.0) / 2.0),
    Math.floor((position[1] + 1.0) / 2.0),
    Math.floor((position[2] + 1.0) / 2.0)
  ];
}

function illegalX(oldX) {
  var oldPos = mazePos([oldX, globals.cameraZ, globals.cameraY]);
  var newPos = mazePos([globals.cameraX, globals.cameraZ, globals.cameraY]);

  if (globals.maze.posEqual(oldPos, newPos)) return false;
  console.log("XXX")
  console.log(oldPos);
  console.log(newPos);
  console.log([globals.cameraX, globals.cameraZ, globals.cameraY]);
  console.log("---")
  return globals.maze.illegalMove(oldPos, newPos);
}

function illegalY(oldY) {
  var oldPos = mazePos([globals.cameraX, globals.cameraZ, oldY]);
  var newPos = mazePos([globals.cameraX, globals.cameraZ, globals.cameraY]);

  if (globals.maze.posEqual(oldPos, newPos)) return false;
  console.log("YYY")
  console.log(oldPos);
  console.log(newPos);
  console.log([globals.cameraX, globals.cameraZ, globals.cameraY]);
  console.log("---")
  return globals.maze.illegalMove(oldPos, newPos);
}

function illegalZ(oldZ) {
  var oldPos = mazePos([globals.cameraX, oldZ, globals.cameraY]);
  var newPos = mazePos([globals.cameraX, globals.cameraZ, globals.cameraY]);

  if (globals.maze.posEqual(oldPos, newPos)) return false;
  console.log("ZZZ")
  console.log(oldPos);
  console.log(newPos);
  console.log([globals.cameraX, globals.cameraZ, globals.cameraY]);
  console.log("---")
  return globals.maze.illegalMove(oldPos, newPos);
}

function drawScene() {
  globals.gl.viewport(0, 0, globals.gl.viewportWidth, globals.gl.viewportHeight);
  globals.gl.clear(globals.gl.COLOR_BUFFER_BIT | globals.gl.DEPTH_BUFFER_BIT);
  mat4.perspective(globals.pMatrix, 45, globals.gl.viewportWidth / globals.gl.viewportHeight, 0.1, 100.0);

  mat4.identity(globals.mvMatrix);

  setCamera();

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, globals.vertBuffer);
  globals.gl.vertexAttribPointer(globals.shaderProgram.vertexPositionAttribute, 3, globals.gl.FLOAT, false, 0, 0);

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, globals.colorBuffer);
  globals.gl.vertexAttribPointer(globals.shaderProgram.vertexColorAttribute, 4, globals.gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  globals.gl.drawArrays(globals.gl.TRIANGLES, 0, globals.count);
}

function setCamera() {
  mat4.rotate(globals.mvMatrix, globals.mvMatrix, degToRad(-globals.pitch), [1, 0, 0]);
  mat4.rotate(globals.mvMatrix, globals.mvMatrix, degToRad(-globals.yaw), [0, 1, 0]);
  mat4.translate(globals.mvMatrix, globals.mvMatrix, vec3.set(vec3.create(), -globals.cameraX, -globals.cameraY, -globals.cameraZ));
}

// INIT FUNCTIONS
function initGL(canvas) {
  try {
    globals.gl = canvas.getContext("webgl");
    globals.gl.viewportWidth = canvas.width;
    globals.gl.viewportHeight = canvas.height;

    globals.mvMatrix = mat4.create();
    globals.pMatrix = mat4.create();

    globals.cameraX = (globals.maze.start[0] * 2);
    globals.cameraY = (globals.maze.start[2] * 2);
    globals.cameraZ = (globals.maze.start[1] * 2);
    globals.pitch = 0;
    globals.yaw = 0;
  } catch(e) { console.log(e); }

  if (!globals.gl) {
    alert("Could not initialise WebGL, sorry :-( ");
  }
}

function initAnimation() {
  globals.speed = 0;
  globals.vertSpeed = 0;
  globals.yawRate = 0;
  globals.pitchRate = 0;
  globals.lastTime = 0;

  globals.noclip = false;
}

function initShaders() {
  var fragmentShader = getShader("fs");
  var vertexShader = getShader("vs");
  var shaderProgram = globals.gl.createProgram();

  globals.gl.attachShader(shaderProgram, vertexShader);
  globals.gl.attachShader(shaderProgram, fragmentShader);
  globals.gl.linkProgram(shaderProgram);

  if (!globals.gl.getProgramParameter(shaderProgram, globals.gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  globals.gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = globals.gl.getAttribLocation(shaderProgram, "aVertexPosition");
  globals.gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = globals.gl.getAttribLocation(shaderProgram, "aVertexColor");
  globals.gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);


  shaderProgram.pMatrixUniform = globals.gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = globals.gl.getUniformLocation(shaderProgram, "uMVMatrix");

  globals.shaderProgram = shaderProgram;
}

// Renders out the vertices of the maze and saves them
function initBuffers() {
  globals.vertBuffer = globals.gl.createBuffer();
  globals.colorBuffer = globals.gl.createBuffer();

  vertices = createMazeVertices(globals.maze);
  globals.count = vertices.length / 3;

  colours = new Array();
  for (var i = 0; i < globals.count; i += 6) {
    colours.push(1.0, 0.0, 0.0, 1.0);
    colours.push(0.0, 1.0, 0.0, 1.0);
    colours.push(0.0, 0.0, 1.0, 1.0);
    colours.push(0.0, 1.0, 0.0, 1.0);
    colours.push(0.0, 0.0, 1.0, 1.0);
    colours.push(1.0, 0.0, 0.0, 1.0);
  }

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, globals.vertBuffer);
  globals.gl.bufferData(globals.gl.ARRAY_BUFFER, new Float32Array(vertices), globals.gl.STATIC_DRAW);

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, globals.colorBuffer);
  globals.gl.bufferData(globals.gl.ARRAY_BUFFER, new Float32Array(colours), globals.gl.STATIC_DRAW);
}

// HELPER/UTIL FUNCTIONS

function mvPushMatrix() {
  if (!("mvMatrixStack" in globals)) {
    globals.mvMatrixStack = [];
  }
  globals.mvMatrixStack.push(mat4.copy(mat4.create(), globals.mvMatrix))
}

function mvPopMatrix() {
  if (globals.mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  globals.mvMatrix = globals.mvMatrixStack.pop();
}

function setMatrixUniforms() {
  globals.gl.uniformMatrix4fv(globals.shaderProgram.pMatrixUniform, false, globals.pMatrix);
  globals.gl.uniformMatrix4fv(globals.shaderProgram.mvMatrixUniform, false, globals.mvMatrix);
}

function getShader(id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    alert("Shader not found");
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
      if (k.nodeType == 3)
          str += k.textContent;
      k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "shader-fragment") {
      shader = globals.gl.createShader(globals.gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "shader-vertex") {
      shader = globals.gl.createShader(globals.gl.VERTEX_SHADER);
  } else {
      return null;
  }

  globals.gl.shaderSource(shader, str);
  globals.gl.compileShader(shader);

  if (!globals.gl.getShaderParameter(shader, globals.gl.COMPILE_STATUS)) {
      alert(globals.gl.getShaderInfoLog(shader));
      return null;
  }

  return shader;
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function createMazeVertices() {
  var vertices = new Array();

  for (var x = 0; x < globals.maze.width; x++) {
    for (var y = 0; y < globals.maze.height; y++) {
      for (var z = 0; z < globals.maze.depth; z++) {
        var cellVerts = createCellVertices([x, y, z]);
        vertices.push(...cellVerts);
      }
    }
  }
  return vertices;
};

function createCellVertices(pos) {
  var cell = globals.maze.fetchCell(pos);
  var vertices = new Array();

  //Don't need to double up, and don't want a floor if it's unnavigable
  if (cell === 0) return vertices;

  if ((cell & globals.maze.CORRIDORS.EAST) === 0) {
    vertices.push(...(rotatedSquare(1)));
  }
  if ((cell & globals.maze.CORRIDORS.NORTH) === 0) {
    vertices.push(...(rotatedSquare(2)));
  }
  if ((cell & globals.maze.CORRIDORS.WEST) === 0) {
    vertices.push(...(rotatedSquare(3)));
  }
  if ((cell & globals.maze.CORRIDORS.SOUTH) === 0) {
    vertices.push(...SQUARE_VERTICES);
  }
  if ((cell & globals.maze.CORRIDORS.UP) === 0) {
    vertices.push(...ROOF_VERTICES);
  }
  if ((cell & globals.maze.CORRIDORS.DOWN) === 0) {
    vertices.push(...FLOOR_VERTICES);
  }

  // Need to translate these positions to be in maze space
  for (var i = 0; i < vertices.length; i += 3) {
    vertices[i] += pos[0] * 2;
    vertices[i + 2] += pos[1] * 2;
    vertices[i + 1] += pos[2] * 2;
  }
  return vertices;
}

// Returns the vertices for a square behind the camera that has been rotated numTurns
// times around the y axis
function rotatedSquare(numTurns) {
  matrix = [ 0, 0, 1,
             0, 1, 0,
            -1, 0, 0];

  vertices = SQUARE_VERTICES.slice();

  for (var i = 0; i < numTurns; i++) {
    for (var j = 0; j < SQUARE_VERTICES.length; j += 3) {
      x = vertices[j+2];
      y = vertices[j+1];
      z = -vertices[j];

      vertices[j] = x;
      vertices[j+1] = y;
      vertices[j+2] = z;
    }
  }
  return vertices;
}

const SQUARE_VERTICES = [
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0
];

const FLOOR_VERTICES = [
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
];

const ROOF_VERTICES = [
  -1.0, 1.0, -1.0,
   1.0, 1.0, -1.0,
   1.0, 1.0,  1.0,
  -1.0, 1.0, -1.0,
   1.0, 1.0,  1.0,
  -1.0, 1.0,  1.0,
];
