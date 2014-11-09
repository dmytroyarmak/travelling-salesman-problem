var _ = require('underscore');
var TSPSolution = require('./TSPSolution');
var MAX_STEPS = 1000;

function getNeighbors (currentSolution) {
  var neighbors = [],
      n = currentSolution.getDimension();

  for (var i = 0; i < n - 1; i++) {
    for (var j = i + 1; j < n; j++) {
      neighbors.push(currentSolution.swapElements(i, j));
    }
  }

  return neighbors;
}

function getBestNeighborg (currentSolution) {
  var neighbors = getNeighbors(currentSolution);
  return _.min(neighbors, function (neighbor) {
    return neighbor.getLength();
  });
}

module.exports.solve = function solve (matrix, initialSolution) {
  var currentSolution = new TSPSolution(matrix, initialSolution);
  var steps = 0;
  var bestNeighbor;

  while(steps < MAX_STEPS) {
    steps += 1;
    bestNeighbor = getBestNeighborg(currentSolution);

    if (bestNeighbor.getLength() < currentSolution.getLength()) {
      currentSolution = bestNeighbor;
    } else {
      break;
    }
  }

  return currentSolution;
};


