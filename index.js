var loadSample = require('./lib/tsplib').loadSample;

loadSample('br17').then(function (sampleData) {
  console.log(sampleData);
});
