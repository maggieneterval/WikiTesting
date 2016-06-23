var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('testing suite capabilities', function () {
  it('sums two numbers', function () {
    var equation = 2 + 2;
    expect(equation).to.equal(4);
  });
  it('uses setTimeout correctly', function (done) {
    var now = new Date();
    setTimeout(function () {
      var elapsed = new Date() - now;
      expect(elapsed).to.be.closeTo(1000, 50);
      done();
    }, 1000);
  });
  it('will invoke a function once per element', function () {
    var arr = [1, 2, 3];
    function logNumber (number) {
      console.log(number);
    }
    logNumber = chai.spy(logNumber);
    arr.forEach(logNumber);
    expect(logNumber).to.have.been.called.exactly(arr.length);
  });
});

