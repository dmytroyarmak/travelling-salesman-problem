var Q = require('q');
var xml2js = require('xml2js');

function createMatrixWithInfinityElements (size) {
  var matrix = [],
      i, j;

  for (i = 0; i < size; i++) {
    matrix[i] = [];
    for (j = 0; j < size; j++) {
      matrix[i][j] = Number.POSITIVE_INFINITY;
    }
  }

  return matrix;
}

function transformParsedXmlToMatrix (parsedXml) {
  var vertexes = parsedXml.travellingSalesmanProblemInstance.graph[0].vertex,
      matrix = createMatrixWithInfinityElements(vertexes.length);

  vertexes.forEach(function (vertex, i) {
    vertex.edge.forEach(function (edge) {
      var j = parseInt(edge._, 10),
          cost = parseFloat(edge.$.cost);

      matrix[i][j] = cost;
    });
  });

  return matrix;
}

module.exports.parse = function parse (data) {
  var parser = new xml2js.Parser();
  return Q.nfcall(parser.parseString, data).then(transformParsedXmlToMatrix);
};
