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

TSPSolution.prototype.toString = function() {
  return '[' + this._path.join(',') + '](' + this.getLength() + ')';
};

module.exports = TSPSolution;
