var sampleXmlReader = require('./sampleXmlReader');
var sampleXmlParser = require('./sampleXmlParser');

module.exports.load = function load (name) {
  return sampleXmlReader.read(name).then(function (sampleXml) {
    return sampleXmlParser.parse(sampleXml);
  });
};
