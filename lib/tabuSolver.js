var _ = require('underscore');
var TSPSolution = require('./TSPSolution');
var MAX_STEPS = 1000;

function getNeighbors (tabuList, currentSolution) {
  var neighbors = [],
      n = currentSolution.getDimension(),
      tabuListLabel, neighbor;

  for (var i = 0; i < n - 1; i++) {
    for (var j = i + 1; j < n; j++) {
      tabuListLabel = i + ':' + j;
      if (!tabuList[tabuListLabel]) {
        neighbor = currentSolution.swapElements(i, j);
        neighbor.tabuListLabel = tabuListLabel;
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}

function getBestNeighborg (tabuList, currentSolution) {
  var neighbors = getNeighbors(tabuList, currentSolution);

  if (neighbors.length) {
    return _.min(neighbors, function (neighbor) {
      return neighbor.getLength();
    });
  } else {
    return null;
  }
}

module.exports.solve = function solve (matrix, initialSolution) {
  var currentSolution = new TSPSolution(matrix, initialSolution);
  var bestSolution = currentSolution;
  var steps = 0;
  var tabuList = {};

  while(steps < MAX_STEPS) {
    steps += 1;
    currentSolution = getBestNeighborg(tabuList, currentSolution);

    if (!currentSolution) {
      break;
    }

    tabuList[currentSolution.tabuListLabel] = true;

    if (currentSolution.getLength() <= bestSolution.getLength()) {
      bestSolution = currentSolution;
    }
  }

  return bestSolution;
};


