var _ = require('underscore');
var TSPSolution = require('./TSPSolution');
var hillClimbingSolver = require('./hillClimbingSolver');
var GENERATIONS_NUMBER = 10000;
var POPULTAION_SIZE = 10;
var CROSSOVER_PORTION = 0.6;
var MUTATION_PROBABILITY = 0.05;

function buildInitialPopulation (matrix, initialSolutions) {
  return _.map(initialSolutions, function(solution) {
    return new TSPSolution(matrix, solution);
  });
}

function getBestGenotypeFromPopulation (population) {
  return _.min(population, function (genotype) {
    return genotype.getLength();
  });
}

function selectionForCrossover (population) {
  var numberForCrossover = getNumberForCrossover(population.length);
  return selection(population, numberForCrossover);
}

function selection (population, size, newPopulation) {
  if (population.length < size) {
    return population;
  } else {
    newPopulation = newPopulation || [];

    _.times(size, function() {
      var populationToChooseFrom =  _.difference(population, newPopulation);
      var selectedGenotype = getGenotypeByFitness(populationToChooseFrom);
      newPopulation.push(selectedGenotype);
    });

    return newPopulation;
  }

}

function getNumberForCrossover (populationSize) {
  var numberForCrossover = Math.floor(populationSize * CROSSOVER_PORTION);
  return makeEven(numberForCrossover);
}

function makeEven (number) {
  return number % 2 === 0 ? number : number + 1;
}

function getGenotypeByFitness (population) {
  var fitnessValues = _.map(population, function(genotype) {
    return 1/genotype.getLength();
  });
  var sumOfFitnessValues = _.reduce(fitnessValues, function(memo, num){
    return memo + num;
  }, 0);
  var normalizedFitnessValues = _.map(fitnessValues, function(fitnessValue) {
    return fitnessValue/sumOfFitnessValues;
  });
  var randomNumber = Math.random();
  var fitnessValue;
  var i;
  var n = normalizedFitnessValues.length;
  for (i = 0; i < n; i += 1) {
    fitnessValue = normalizedFitnessValues[i];
    if (randomNumber < fitnessValue) {
      return population[i];
    } else {
      randomNumber -= fitnessValue;
    }
  }
}

function populationCrossover (population) {
  var pairs = getPairsFromPopulation(population);
  var chidlren = [];

  _.each(pairs, function(pair) {
    var x = pair[0];
    var y = pair[1];
    chidlren.push(x.crossOver(y));
    chidlren.push(y.crossOver(x));
  });

  return chidlren;
}

function getPairsFromPopulation (population) {
  var pairs = [];
  var n = population.length;
  var i;
  for (i = 0; i < n; i += 2){
    pairs.push([population[i], population[i + 1]]);
  }
  return pairs;
}

function populationMutation (population) {
  return _.map(population, function(genotype) {
    if (Math.random() < MUTATION_PROBABILITY) {
      // return genotype.randomSwap().randomSwap().randomSwap();
      return hillClimbingSolver.solve(genotype._matrix, genotype.getPath());
    } else {
      return genotype;
    }
  });
}

function selectForLife (population) {
  var best = getBestGenotypeFromPopulation(population);
  var newPopulation = [best];
  return selection(population, POPULTAION_SIZE, newPopulation);
}

module.exports.solve = function solve (matrix, initialSolutions) {
  var population = buildInitialPopulation(matrix, _.first(initialSolutions, POPULTAION_SIZE));

  _.times(GENERATIONS_NUMBER, function() {
    var populationForCrossover = selectionForCrossover(population);
    var chidlren = populationCrossover(populationForCrossover);
    var mutatedPopulation = populationMutation(population.concat(chidlren));
    population = selectForLife(mutatedPopulation);
  });

  var bestResult = getBestGenotypeFromPopulation(population);
  return hillClimbingSolver.solve(bestResult._matrix, bestResult.getPath());
};
