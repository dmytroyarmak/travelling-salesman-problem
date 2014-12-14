var _ = require('underscore');
var async = require('async');
var microtime = require('microtime');

var loadSample = require('./lib/tsplib').loadSample;
var TSPSolution = require('./lib/TSPSolution');
var hillClimbingSolver = require('./lib/hillClimbingSolver');
var tabuSolver = require('./lib/tabuSolver');
var simulatedAnnealingSolver = require('./lib/simulatedAnnealingSolver');

var SAMPLES = [
  'br17',
  'bays29',
  'ftv33',
  'ftv35',
  'swiss42',
  'p43',
  'ftv44',
  'ftv47',
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

function solveAndPrint (label, solver, sampleData) {
    var startTime = microtime.nowDouble();
    var allSolutions = solveForEachInitialState(solver, sampleData);
    var bestSolution = getBestSolution(allSolutions);
    var endTime = microtime.nowDouble();
    var diffTime = (endTime - startTime)/10;

    console.log(label, bestSolution.toString(), diffTime.toFixed(3));
}

function loadAndSolveSample (sampleName) {
  return loadSample(sampleName).then(function (sampleData) {
    var bestInitialSolution = getBestInitialSolution(sampleData);
    console.log('Sample:', sampleName);
    console.log('Best initial solution:', bestInitialSolution.toString());
    solveAndPrint('Best Hill-Climbing solution:', hillClimbingSolver, sampleData);
    solveAndPrint('Best Tabu solution:', tabuSolver, sampleData);
    solveAndPrint('Best Simulated Annealing solution:', simulatedAnnealingSolver, sampleData);
    console.log();
  });
}

async.eachSeries(SAMPLES, function (sampleName, done) {
  loadAndSolveSample(sampleName).then(done, function (err) {
    console.log(err);
  });
});
