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

window.addEventListener("keydown", function(event) {
  if (event.defaultPrevented) return;

  switch (event.key) {
    case "ArrowDown":
    case "s":
      move(false);
      break;
    case "ArrowUp":
    case "w":
      move(true);
      break;
    case "ArrowLeft":
    case "a":
      turn(true);
      break;
    case "ArrowRight":
    case "d":
      turn(false);
      break;
    case "PageUp":
    case "e":
      look(true);
      break;
    case "PageDown":
    case "q":
      look(false);
      break;
    case "Home":
    case "y":
      ascend(true);
      break;
    case "End":
    case "g":
      ascend(false);
      break;
    default:
      return;
  }
  event.preventDefault();
}, true);

window.addEventListener("keyup", function(event) {
  if (event.defaultPrevented) return;

  switch (event.key) {
    case "ArrowDown":
    case "s":
    case "ArrowUp":
    case "w":
      globals.speed = 0;
      break;
    case "ArrowLeft":
    case "a":
    case "ArrowRight":
    case "d":
      globals.yawRate = 0;
      break;
    case "PageUp":
    case "e":
    case "PageDown":
    case "q":
      globals.pitchRate = 0;
      break;
    case "Home":
    case "y":
    case "End":
    case "g":
      globals.vertSpeed = 0;
      break;
    case "k":
      globals.noclip = true;
      break;
    case "l":
      globals.noclip = true;
      break;
    default:
      return;
  }
  event.preventDefault();
}, true);

function move(forward) {
  globals.speed = 0.003;
  if (!forward) globals.speed *= -1;
}

function turn(left) {
  globals.yawRate = 0.1;
  if (!left) globals.yawRate *= -1;
}

function look(up) {
  globals.pitchRate = 0.1
  if (!up) globals.pitchRate *= -1;
}

function ascend(up) {
  globals.vertSpeed = 0.003;
  if (!up) globals.vertSpeed *= -1;
}
