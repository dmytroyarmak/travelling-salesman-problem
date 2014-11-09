var fs = require('fs');
var Q = require('q');

module.exports.readByPath = function readByPath (path) {
  return Q.nfcall(fs.readFile, path);
};

module.exports.read = function read (name) {
  return this.readByPath(__dirname + '/samples/' + name + '.xml');
};
