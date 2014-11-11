var _ = require('underscore');
var async = require('async');
var microtime = require('microtime');

var loadSample = require('./lib/tsplib').loadSample;
var TSPSolution = require('./lib/TSPSolution');
var hillClimbingSolver = require('./lib/hillClimbingSolver');
var tabuSolver = require('./lib/tabuSolver');

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

    console.log('Sample:', sampleName);
    console.log('Best initial solution:', bestInitialSolution.toString());
    console.log('Best Hill-Climbing solution:', bestHCSolution.toString(), diffHCTime.toFixed(3));
    console.log('Best Tabu solution:', bestTabuSolution.toString(), diffTabuTime.toFixed(3));
    console.log();
  });
}

async.eachSeries(SAMPLES, function (sampleName, done) {
  loadAndSolveSample(sampleName).then(done, function (err) {
    console.log(err);
  });
});
