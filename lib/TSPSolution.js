var _ = require('underscore');

function TSPSolution (matrix, path) {
  this._path = path;
  this._matrix = matrix;
}

TSPSolution.prototype.getDimension = function() {
  return this._path.length;
};

TSPSolution.prototype.getLength = function() {
  var length = 0,
      currentNode, nextNode, i;

  for (i = 0; i < this._path.length; i++) {
    currentNode = this._path[i];
    nextNode = this._path[(i + 1)%this._path.length];
    length += this._matrix[currentNode][nextNode];
  }

  return length;
};

TSPSolution.prototype.swapElements = function (i, j) {
  var newPath = this._path.slice();
  newPath[i] = this._path[j];
  newPath[j] = this._path[i];
  return new TSPSolution(this._matrix, newPath);
};

TSPSolution.prototype.randomSwap = function () {
  var n = this.getDimension(),
      randomVertexes = _.sample(_.range(n), 2),
      i = randomVertexes[0],
      j = randomVertexes[1];

  return this.swapElements(i, j);
};

TSPSolution.prototype.crossOver = function (other) {
  var x = this.getPath();
  var n = this.getDimension();
  var y = other.getPath();
  var z = [];
  var k1 = _.random(0, Math.floor(n/2));
  var k2 = _.random(k1 + 1, n);
  var i;
  for (i = k1; i < k2; i += 1){
    z[i] = x[i];
  }
  var zy = _.difference(_.rest(y, k2), z).concat(_.difference(_.first(y, k2), z));
  for (i = k2; i < n; i += 1){
    z[i] = zy[i - k2];
  }
  for (i = 0; i < k1; i += 1){
    z[i] = zy[n - k2 + i];
  }
  return new TSPSolution(this._matrix, z);
};

TSPSolution.prototype.toString = function() {
  return '[' + this._path.join(',') + '](' + this.getLength() + ')';
};

TSPSolution.prototype.getPath = function() {
  return this._path;
};

module.exports = TSPSolution;
