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

class Maze {
  constructor(width, height, depth) {
    // Passable directions - a cell's value is the sum of it's passable directions.
    this.CORRIDORS = {
      NONE: 0,
      EAST: 1,
      NORTH: 2,
      WEST: 4,
      SOUTH: 8,
      UP: 16,
      DOWN: 32
    };

    // Allows for easy iteration through the movable directions
    this.DIRECTIONS = [
      this.CORRIDORS.EAST,
      this.CORRIDORS.NORTH,
      this.CORRIDORS.WEST,
      this.CORRIDORS.SOUTH,
      this.CORRIDORS.UP,
      this.CORRIDORS.DOWN
    ];

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.initCells();

    this.start = this.randomPosition(this.width, this.height, 0);
    this.end = this.randomPosition(this.width, this.height, this.depth - 1);

    this.carve(this.start, this.CORRIDORS.DOWN);
    this.carve(this.end, this.CORRIDORS.UP);

    this.recursiveBacktrack(this.start);
  }

  opposite(direction) {
    switch(direction) {
      case this.CORRIDORS.EAST:
        return this.CORRIDORS.WEST;
      case this.CORRIDORS.WEST:
        return this.CORRIDORS.EAST;
      case this.CORRIDORS.NORTH:
        return this.CORRIDORS.SOUTH;
      case this.CORRIDORS.SOUTH:
        return this.CORRIDORS.NORTH;
      case this.CORRIDORS.UP:
        return this.CORRIDORS.DOWN;
      case this.CORRIDORS.DOWN:
        return this.CORRIDORS.UP;
    }
  }

  shuffle(dirs) {
    var array = dirs.slice(0);

    // Iterate through the array, swapping each element with
    // one of the elements in an unvisited position
    for (var i = array.length - 1; i > 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  }

  randomPosition(maxX, maxY, depth) {
    return [
      Math.floor(Math.random() * maxX),
      Math.floor(Math.random() * maxY),
      depth
    ];
  }

  illegalMove(posA, posB) {
    if (this.posEqual(posA, posB)) return false;
    if (!this.inBounds(posB)) return true;
    if (this.fetchCell(posB) === 0) return true;

    var absDiff = 0;

    for (var i = 0; i < posA.length; i++) {
      absDiff += Math.abs(posA[i] - posB[i]);
    }

    if (absDiff > 1) return true;

    var cellA = this.fetchCell(posA);

    var xDiff = posA[0] - posB[0];
    var yDiff = posA[1] - posB[1];
    var zDiff = posA[2] - posB[2];

    if (xDiff !== 0) {
      if (xDiff < 0) {
        if ((cellA & this.CORRIDORS.EAST) === 0) return true;
        return false;
      } else {
        if ((cellA & this.CORRIDORS.WEST) === 0) return true;
        return false;
      }
    }
    else if (yDiff !== 0) {
      if (yDiff < 0) {
        if ((cellA & this.CORRIDORS.NORTH) === 0) return true;
        return false;
      } else {
        if ((cellA & this.CORRIDORS.SOUTH) === 0) return true;
        return false;
      }
    } else if (zDiff !== 0) {
      if (zDiff < 0) {
        if ((cellA & this.CORRIDORS.DOWN) === 0) return true;
        return false;
      } else {
        if ((cellA & this.CORRIDORS.UP) === 0) return true;
        return false;
      }
    }
  }

  posEqual(posA, posB) {
    if (posA.length !== posB.length) return false;

    for (var i = 0; i < posA.length; i++) {
      if (posA[i] !== posB[i]) return false;
    }
    return true;
  }

  move(position, direction) {
    switch(direction) {
      case this.CORRIDORS.EAST:
        return [position[0] + 1, position[1], position[2]];
      case this.CORRIDORS.WEST:
        return [position[0] - 1, position[1], position[2]];
      case this.CORRIDORS.NORTH:
        return [position[0], position[1] - 1, position[2]];
      case this.CORRIDORS.SOUTH:
        return [position[0], position[1] + 1, position[2]];
      case this.CORRIDORS.UP:
        return [position[0], position[1], position[2] + 1];
      case this.CORRIDORS.DOWN:
        return [position[0], position[1], position[2] - 1];
    }
  }

  initCells() {
    this.cells = new Array(this.width);

    for (var i = 0; i < this.width; i++) {
      this.cells[i] = new Array(this.height);

      for (var j = 0; j < this.height; j++) {
        this.cells[i][j] = new Array(this.depth).fill(this.CORRIDORS.NONE);
      }
    }
  }

  // Main maze generation algorithm
  recursiveBacktrack(position) {
    var directions = this.shuffle(this.DIRECTIONS);

    for (var i = 0; i < directions.length; i++) {
      var newPos = this.move(position, directions[i]);

      if (this.canMove(newPos, this.opposite(directions[i]))) {
        this.carve(position, directions[i]);
        this.carve(newPos, this.opposite(directions[i]));
        this.recursiveBacktrack(newPos);
      }
    }

    if (this.fetchCell(this.end) === this.CORRIDORS.UP) {
      this.carveToExisting(this.end);
    }
  }

  // Iterative recursive backtrack - need to be able to carve into carved cells but not visited cells
  // And don't worry about sparseness constraints
  carveToExisting(position) {
    var stack = new Array();
    var visited = new Array();

    stack.push([position, null, null]);

    while (!stack.length == 0) {
      var [pos, oldPos, dir] = stack.pop();

      // If we've already visited, skip. Otherwise visit
      if (this.containsPos(visited, pos)) continue;
      visited.push(pos);

      // If we came here from somewhere, carve the path. If this new place has been carved,
      // we're done
      if (oldPos !== null) {
        var done = (this.fetchCell(pos) !== 0);

        this.carve(oldPos, dir);
        this.carve(pos, this.opposite(dir));

        if (done) return;
      }

      var directions = this.shuffle(this.DIRECTIONS.slice(0, 4));

      for (var i = 0; i < directions.length; i++) {
        var newPos = this.move(position, directions[i]);

        if (this.inBounds(newPos)) {
          stack.push([newPos, pos, directions[i]]);
        }
      }
    }
  }

  carve(position, direction) {
    this.cells[position[0]][position[1]][position[2]] = this.fetchCell(position) + direction;
  }

  canMove(pos, direction) {
    if (!this.inBounds(pos)) return false;
    if (this.fetchCell(pos) !== 0) return false;

    // Check 1 square in every direction apart from the one we came from.
    // We want to make sure none are visited, to have a maze that isn't fully carved.
    for (var i = 0; i < this.DIRECTIONS.length; i++) {
      if (this.DIRECTIONS[i] === direction) continue;

      var newPos = this.move(pos, this.DIRECTIONS[i]);
      if (this.inBounds(newPos) && this.fetchCell(newPos) !== 0) return false;
    }
    return true;
  }

  containsPos(array, pos) {
    for (var i = 0; i < array.length; i++) {
      if (this.posEqual(array[i], pos)) return true;
    }
    return false;
  }

  inBounds(pos) {
    if (!(pos[0] >= 0 && pos[0] < this.cells.length)) return false;
    if (!(pos[1] >= 0 && pos[1] < this.cells[0].length)) return false;

    return (pos[2] >= 0 && pos[2] < this.cells[0][0].length);
  }

  fetchCell(position) {
    return this.cells[position[0]][position[1]][position[2]];
  }
}
