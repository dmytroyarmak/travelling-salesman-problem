//base algorithm definition of hill climbing
var IIA = require('algorithmbox').IIA;
var defineClass = require('simple-cls').defineClass;

//extend the framework-provided IIA definition
var MyIIA = defineClass({
    name : 'MyIIA',
    extend : IIA,
    methods : {

        //given a candidate solution, return a set of neighborhood
        //solutions that can be reached by 1-point mutation
        'neighbors' : function neighbors(candidate) {
          return [candidate];
        }
    }
});

var TSP = require('algorithmbox').Example.TSP;
var fs = require('fs');

//load tsp instance from file
var raw = fs.readFileSync('tsplib/br17.xml');

//parse data and create a TSP instance
var instance = new TSP(TSP.parseData(raw));

//create a IIA algorithm with predefined terminate condition
var algs = new MyIIA(instance, {
    'terminate_ls_steps' : 1000  //stop if maximum search steps reached
});

//run the algorithm and monitor progress
algs.run(function(step){
    console.log('step %d. best found solution: [%s]', step, algs.best_sol);
    if(algs.lo_trap)
        console.log('trapped');  //algorithm trapped in local optima
});
