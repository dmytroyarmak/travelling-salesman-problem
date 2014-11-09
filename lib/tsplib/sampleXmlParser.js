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
      matrix = createMatrixWithInfinityElements(vertexes.length),
      initialSolutions = [];

  vertexes.forEach(function (vertex, i) {
    vertex.edge.forEach(function (edge) {
      var j = parseInt(edge._, 10),
          cost = parseFloat(edge.$.cost);

      matrix[i][j] = cost;
    });
  });

  initialSolutions = parsedXml.travellingSalesmanProblemInstance.initialSolutions[0].path.map(function (path) {
    return path.vertex.map(function (vertex) {
      return parseInt(vertex, 10);
    });
  });

  return {
    data: matrix,
    initialSolutions: initialSolutions,
    size: matrix.length
  };
}

module.exports.parse = function parse (data) {
  var parser = new xml2js.Parser();
  return Q.nfcall(parser.parseString, data).then(transformParsedXmlToMatrix);
};
