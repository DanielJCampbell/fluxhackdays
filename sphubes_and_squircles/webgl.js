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

globals = {}

function webGLStart(rasterFunc) {
  var canvas = document.getElementById("canvas");
  initGL(canvas);
  initShaders();
  initBuffers();

  globals.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  globals.gl.enable(globals.gl.DEPTH_TEST);
  globals.rasterFunc = rasterFunc;

  initAnimation();

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
    globals.angle += ((75 * elapsed) / 1000.0);

    if (globals.angle > 360.0) {
      globals.angle -= 360.0;
    }
  }
  globals.lastTime = timeNow;
}

function drawScene() {
  globals.gl.viewport(0, 0, globals.gl.viewportWidth, globals.gl.viewportHeight);
  globals.gl.clear(globals.gl.COLOR_BUFFER_BIT | globals.gl.DEPTH_BUFFER_BIT);
  mat4.perspective(globals.pMatrix, 45, globals.gl.viewportWidth / globals.gl.viewportHeight, 0.1, 100.0);

  mat4.identity(globals.mvMatrix);
  mat4.translate(globals.mvMatrix, globals.mvMatrix, vec3.set(vec3.create(), 0.0, 0.0, -60));
  mat4.rotate(globals.mvMatrix, globals.mvMatrix, degToRad(globals.angle), [1, 1, 1]);

  coord_list = globals.rasterFunc(globals.width);

  for (var i = 0; i < coord_list.length; i++) {
    drawCube(coord_list[i]);
  }
}

function drawCube(coords) {
  mvPushMatrix();

  mat4.translate(globals.mvMatrix, globals.mvMatrix, vec3.set(vec3.create(), coords[0], coords[1], coords[2]));

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, globals.vertBuffer);
  globals.gl.vertexAttribPointer(globals.shaderProgram.vertexPositionAttribute, 3, globals.gl.FLOAT, false, 0, 0);

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, globals.normalBuffer);
  globals.gl.vertexAttribPointer(globals.shaderProgram.vertexNormalAttribute, 3, globals.gl.FLOAT, false, 0, 0);

  globals.gl.bindBuffer(globals.gl.ELEMENT_ARRAY_BUFFER, globals.indexBuffer);
  setMatrixUniforms();
  globals.gl.drawElements(globals.gl.TRIANGLES, 36, globals.gl.UNSIGNED_SHORT, 0);

  mvPopMatrix();
}

// INIT FUNCTIONS
function initGL(canvas) {
  try {
    globals.gl = canvas.getContext("webgl");
    globals.gl.viewportWidth = canvas.width;
    globals.gl.viewportHeight = canvas.height;

    globals.mvMatrix = mat4.create();
    globals.pMatrix = mat4.create();
  } catch(e) { console.log(e); }

  if (!globals.gl) {
    alert("Could not initialise WebGL, sorry :-( ");
  }
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

  shaderProgram.vertexNormalAttribute = globals.gl.getAttribLocation(shaderProgram, "aVertexNormal");
  globals.gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.pMatrixUniform = globals.gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = globals.gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.nMatrixUniform = globals.gl.getUniformLocation(shaderProgram, "uNMatrix");

  globals.shaderProgram = shaderProgram;
}

// Only need the one square, as every cube is identical, just reordered.
function initBuffers() {
  var vertBuffer = globals.gl.createBuffer();
  var indexBuffer = globals.gl.createBuffer();
  var normalBuffer = globals.gl.createBuffer();

  vertices = [
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,

    // Back face
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,

    // Top face
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,

    // Bottom face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,

    // Right face
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,

    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5
  ];

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, vertBuffer);
  globals.gl.bufferData(globals.gl.ARRAY_BUFFER, new Float32Array(vertices), globals.gl.STATIC_DRAW);

  var indices = [
    0, 1, 2,      1, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
  ];

  globals.gl.bindBuffer(globals.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  globals.gl.bufferData(globals.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), globals.gl.STATIC_DRAW);

  var vertexNormals = [
    // Front face
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back face
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top face
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom face
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right face
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left face
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];

  globals.gl.bindBuffer(globals.gl.ARRAY_BUFFER, normalBuffer);
  globals.gl.bufferData(globals.gl.ARRAY_BUFFER, new Float32Array(vertexNormals), globals.gl.STATIC_DRAW);

  globals.vertBuffer = vertBuffer;
  globals.indexBuffer = indexBuffer;
  globals.normalBuffer = normalBuffer;
}

function initAnimation() {
  globals.lastTime = 0;
  globals.angle = 0;
  globals.width = 1;
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

  var normalMatrix = mat3.create();
  mat3.normalFromMat4(normalMatrix, globals.mvMatrix);
  globals.gl.uniformMatrix3fv(globals.shaderProgram.nMatrixUniform, false, normalMatrix);
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
