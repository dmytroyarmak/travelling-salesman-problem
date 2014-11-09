var Q = require('q');

var sampleLoader = require('../lib/tsplib/sampleLoader');
var sampleXmlReader = require('../lib/tsplib/sampleXmlReader');
var sampleXmlParser = require('../lib/tsplib/sampleXmlParser');

describe('sampleLoader', function () {
  describe('.loadSample(name)', function () {
    var readDeferred, result;

    beforeEach(function () {
      readDeferred = Q.defer();

      spyOn(sampleXmlReader, 'read').andReturn(readDeferred.promise);
      spyOn(sampleXmlParser, 'parse').andReturn('parsedData');

      result = sampleLoader.load('sampleName');
    });

    it('should call sampleXmlReader.read', function () {
      expect(sampleXmlReader.read).toHaveBeenCalledWith('sampleName');
    });

    it('should return pending promise', function () {
      expect(Q.isPending(result)).toBe(true);
    });

    describe('when reading is finished', function () {
      beforeEach(function () {
        readDeferred.resolve('readData');
      });

      it('should call sampleXmlParser.parse', function (done) {
        result.then(function () {
          expect(sampleXmlParser.parse).toHaveBeenCalledWith('readData');
          done();
        });
      });

      it('should resolve returned promise with parsed data', function (done) {
        result.then(function (resultData) {
          expect(resultData).toBe('parsedData');
          done();
        });
      });
    });
  });
});

describe('sampleXmlReader', function () {
  describe('.read(name)', function () {
    var result;

    beforeEach(function () {
      spyOn(sampleXmlReader, 'readByPath').andReturn('readByPathData');

      result = sampleXmlReader.read('exampleName');
    });

    it('should call readByPath', function () {
      expect(sampleXmlReader.readByPath).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('should return result of readByPath', function () {
      expect(result).toBe('readByPathData');
    });
  });
});
