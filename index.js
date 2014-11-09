//base algorithm definition of hill climbing
var fs = require('fs');
var TSP = require('algorithmbox').Example.TSP;
var LS = require('./lib/LS');

//load tsp instance from file
var raw = fs.readFileSync('tsplib/br17.xml');

//parse data and create a TSP instance
var instance = new TSP(TSP.parseData(raw));

//create a IIA algorithm with predefined terminate condition
var algs = new LS(instance, {
    'terminate_ls_steps' : 100  //stop if maximum search steps reached
});

//run the algorithm and monitor progress
algs.run(function(step){
    console.log('step %d. best found solution: [%s]', step, algs.best_sol);
    if(algs.lo_trap)
        console.log('trapped');  //algorithm trapped in local optima
});
