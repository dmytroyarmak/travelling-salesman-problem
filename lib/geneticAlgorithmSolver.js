var TSPSolution = require('./TSPSolution');

module.exports.solve = function solve (matrix, initialPopulation) {
  var currentSolution = new TSPSolution(matrix, initialPopulation[0]);
  return currentSolution;
};
