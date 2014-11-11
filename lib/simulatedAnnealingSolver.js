var _ = require('underscore');
var TSPSolution = require('./TSPSolution');
var STEPS_AT_FIXED_T = 100;
var MAX_T = 10000000;
var MIN_T = 0.000001;
var T_COEF = 0.9;

function getRandomNeighborg (currentSolution) {
  var n = currentSolution.getDimension(),
      randomVertexes = _.sample(_.range(n), 2),
      i = randomVertexes[0],
      j = randomVertexes[1];

  return currentSolution.swapElements(i, j);
}

function moveAcceptance (diff, t) {
  return Math.pow(Math.E, -diff/t);
}

module.exports.solve = function solve (matrix, initialSolution) {
  var currentSolution = new TSPSolution(matrix, initialSolution);
  var bestSolution = currentSolution;
  var t = MAX_T;
  var randomNeighbor;
  var steps;
  var diff;

  while(t > MIN_T) {
    steps = 0;

    while(steps < STEPS_AT_FIXED_T) {
      steps = steps + 1;

      randomNeighbor = getRandomNeighborg(currentSolution);
      diff = randomNeighbor.getLength() - currentSolution.getLength();

      if (diff < 0 || Math.random() < moveAcceptance(diff, t)) {
        currentSolution = randomNeighbor;

        if (currentSolution.getLength() < bestSolution.getLength()) {
          bestSolution = currentSolution;
        }
      }
    }

    t = t*T_COEF;
  }

  return bestSolution;
};


