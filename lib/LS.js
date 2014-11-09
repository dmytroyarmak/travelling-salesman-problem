//base algorithm definition of hill climbing
var IIA = require('algorithmbox').IIA;
var defineClass = require('simple-cls').defineClass;
var assert = require('assert');
var $V = require('sylvester').Vector.create;
var TSPSolution = require('algorithmbox').Example.TSP_Solution;

var swapElementsInVector = function(vector, i, j) {
  var newVectorElements = vector.elements.slice();
  newVectorElements[i] = vector.elements[j];
  newVectorElements[j] = vector.elements[i];
  return $V(newVectorElements);
};

//extend the framework-provided IIA definition
module.exports = defineClass({
    name : 'LS',
    extend : IIA,
    methods : {
        //given a candidate solution, return a set of neighborhood
        //solutions that can be reached by 1-point mutation by swapping cities
        neighbors: function(candidate) {
          assert(this.problem.valid(candidate));
          var neighbors = [],
              n = this.problem.dimension(),
              neighbor;

          for (var i = 0; i < n - 1; i++) {
            for (var j = i + 1; j < n; j++) {
              neighbor = new TSPSolution(swapElementsInVector(candidate.data, i, j));
              neighbor.fitness = this.problem.fitness(neighbor); //make sure we evaluate the neighbor before returning
              neighbors.push(neighbor);
            }
          }

          return neighbors;
        }
    }
});
