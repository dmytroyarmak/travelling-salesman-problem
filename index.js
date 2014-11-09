var _ = require('underscore');
var async = require('async');
var loadSample = require('./lib/tsplib').loadSample;
var hillClimbingSolver = require('./lib/hillClimbingSolver');
var tabuSolver = require('./lib/tabuSolver');
var TSPSolution = require('./lib/TSPSolution');
var microtime = require('microtime');

var SAMPLES = [
  'br17',
  'bays29',
  'ftv33',
  'ftv35',
  'swiss42',
  'p43',
  'ftv44',
  'ftv47',
  'att48',
  'ry48p',
  'eil51',
  'berlin52',
  'ft53',
  'ftv55',
  'ftv64',
  'eil76',
  'eil101'
];

function getBestSolution (solutions) {
  return _.min(solutions, function (solution) {
    return solution.getLength();
  });
}

function getBestInitialSolution (sampleData) {
  var initialSolutions = sampleData.initialSolutions.map(function (initialSolution) {
    return new TSPSolution(sampleData.data, initialSolution);
  });

  return getBestSolution(initialSolutions);
}

function solveForEachInitialState (solver, sampleData) {
  return sampleData.initialSolutions.map(function (initialSolution) {
    return solver.solve(sampleData.data, initialSolution);
  });
}

function loadAndSolveSample (sampleName) {
  return loadSample(sampleName).then(function (sampleData) {
    var bestInitialSolution = getBestInitialSolution(sampleData);

    var startHCTime = microtime.nowDouble();
    var allHCSolutions = solveForEachInitialState(hillClimbingSolver, sampleData);
    var bestHCSolution = getBestSolution(allHCSolutions);
    var endHCTime = microtime.nowDouble();
    var diffHCTime = (endHCTime - startHCTime)/10;

    var startTabuTime = microtime.nowDouble();
    var allTabuSolutions = solveForEachInitialState(tabuSolver, sampleData);
    var bestTabuSolution = getBestSolution(allTabuSolutions);
    var endTabuTime = microtime.nowDouble();
    var diffTabuTime = (endTabuTime - startTabuTime)/10;

    console.log(sampleName, bestInitialSolution.getLength(), bestHCSolution.getLength(), diffHCTime.toFixed(3), bestTabuSolution.getLength(), diffTabuTime.toFixed(3));
  });
}

async.eachSeries(SAMPLES, function (sampleName, done) {
  loadAndSolveSample(sampleName).then(done, function (err) {
    console.log(err);
  });
});
