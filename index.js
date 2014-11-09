var loadSample = require('./lib/tsplib').loadSample;

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

loadSample(SAMPLES[0]).then(function (sampleData) {
  console.log(sampleData);
});
