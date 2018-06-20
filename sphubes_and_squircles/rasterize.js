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

// Given a radius, returns the list of squares
// that best represent that circle.
function rasterize2DFilled(width) {
  var octant = rasterize_full_octant(width / 2.0);
  return octant_circle(octant);
}

function rasterize2D(width) {
  var octant = rasterize_octant(width / 2.0);
  return octant_circle(octant);
}

function rasterizeSphere(width) {
  var coord_list = [];
  var radius = width / 2.0;
  var offsetRadius = radius - 0.5;
  var rSquared = radius * radius;

  for (var y = -offsetRadius; y <= offsetRadius; y++) {
    for (var x = -offsetRadius; x <= offsetRadius; x++) {
      for (var z = -offsetRadius; z <= offsetRadius; z++) {
        if ((x*x + y*y + z*z) <= rSquared) {
          if (perimeter(x, y, z, rSquared)) {
            coord_list.push([x, y, z]);
          }
        }
      }
    }
  }
  return coord_list;
}

function perimeter(x, y, z, radius) {
  var maxX = Math.max((x + 1) * (x + 1), (x - 1) * (x - 1));
  var maxY = Math.max((y + 1) * (y + 1), (y - 1) * (y - 1));
  var maxZ = Math.max((z + 1) * (z + 1), (z - 1) * (z - 1));

  return ((maxX + y*y + z*z > radius) || (maxY + z*z + x*x > radius) || (maxZ + x*x + y*y > radius));
}


function rasterize3D(width) {
  // Stage 1: Cheat, and just do the circle
  coords2D = rasterize2D(width);

  return coords2D.map(function(coord) {
    return [coord[0], coord[1], 0.0];
  });
}

function rasterize3DFilled(width) {
  // Stage 1: Cheat, and just do the circle
  coords2D = rasterize2DFilled(width);

  return coords2D.map(function(coord) {
    return [coord[0], coord[1], 0.0];
  });
}

// A circle is composed of 8 symmetrical octants.
// We use the octant starting from [0, radius] (the top of the circle)
function rasterize_full_octant(radius) {
  coord_list = [];
  rSquared = radius * radius;

  for (var y = 0.5; y <= radius; y++) {
    for (var x = 0.5; x <= y; x++) {
      if ((x*x + y*y) <= rSquared) {
        coord_list.push([x, y]);
      }
    }
  }
  return coord_list;
}

// As above, but using the Midpoint circle algorithm to get just the perimeter.

// The algorithm is as follows: increment x every step (as we know in this octant x is always increasing)
// By keeping track of the radius error as a decision variable, we know when to decrement y.
// RE starts at 0 (as we start on the radius), and then increases by 2x + 1 for every step.
// If it is greater than 0, we decrement y and reduce the error by 2*y + 1
function rasterize_octant(radius) {
  coord_list = [];

  rSquared = radius * radius;

  // Need to account for the fact that the actual squares have a width too.
  x = 0, y = radius - 0.5;

  if ((radius * 2) % 2 == 0) {
    x = 0.5;
  }
  error = 0;

  while (y >= x) {
    coord_list.push([x, y]);
    x += 1;

    if (error <= 0) {
      error += 2 * x + 1;
    } else {
      y -= 1;
      error += 2 * (x - y) + 1;
    }
  }
  return coord_list;
}


function drawSquares(coord_list) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < coord_list.length; i++) {
    var x = coord_list[i][0] * 10 + 295;
    var y = coord_list[i][1] * 10 + 295;

    ctx.strokeRect(x, y, 10, 10);
  }
}

// Given a rasterized octant, gives the full circle.
// Note: returned coord list is unordered
function octant_circle(octant) {
  all_octants = [];
  for (var i = 0; i < octant.length; i++) {
    elem = octant[i];

    all_octants.push(elem);
    all_octants.push([elem[1], elem[0]]);

    if (elem[0] == 0) {
      all_octants.push([elem[0], -elem[1]]);
      all_octants.push([-elem[1], elem[0]]);
    }
    else {
      all_octants.push([elem[0], -elem[1]]);
      all_octants.push([-elem[1], elem[0]]);
      all_octants.push([-elem[0], -elem[1]]);
      all_octants.push([-elem[1], -elem[0]]);
      all_octants.push([-elem[0], elem[1]]);
      all_octants.push([elem[1], -elem[0]]);
    }
  }
  return uniq(all_octants);
}

function uniq(list) {
  var seen = {};
    return list.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
