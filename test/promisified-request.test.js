var moduleToTest  = "../promisified-request";
var proxyquire  = require("proxyquire")
var chai        = require("chai")
var sinon       = require("sinon")
var sinonChai   = require("sinon-chai")

chai.use(sinonChai)
var should = chai.should()
var expect = chai.expect

var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var when = require("when");

describe("promised-request", function () {

  var promisedRequest = require(moduleToTest);
  var requestMock
  var testUrl
  var testOptions

  beforeEach(function () {
    requestMock = {
      get: function (){},
      post: function () {}
    }

    testUrl = 'http://www.domain.com'
    testOptions = { test: 'test' }
  })

  describe("#create()", function () {
    it("should return a request object", function () {
      promisedRequest.create(createStubForRequest()).should.have.a.property("get")
    })
    it("should perform a get request on the 'request' obj that was passed", function () {
      var mock = sinon.mock(requestMock).expects("get").withArgs(testOptions)
      promisedRequest.create(requestMock).get(testOptions)
      mock.verify()
    })
    it("should perform a post request on the 'request' obj that was passed", function () {
      var mock = sinon.mock(requestMock).expects("post").withArgs(testOptions)
      promisedRequest.create(requestMock).post(testOptions)
      mock.verify()
    })
    it("should perform a request on the 'request' object", function () {
      var mock = sinon.mock().withArgs(testOptions)
      promisedRequest.create(mock)(testOptions)
      mock.verify()
    })
  })
  describe("#get()", function () {
    it("should return a promise", function () {
      promisedRequest.get(createStubForRequestOptions(), { get: createStubForRequest() })
        .should.have.a.property("then")
    })
    it("should throw an error when arguments are missing", function () {
      expect(promisedRequest.get).to.throw(Error)
    })
    it("should be rejected if response have error", function (done) {
      promisedRequest.get(
        createStubForRequestOptions(),
        { get: createStubForRequest([new Error()]) }
      ).should.be.rejected.and.notify(done);
    })
    it("should perform get on request object", function () {
      var requestSpy  = { "get": sinon.spy() };
      promisedRequest.get({ }, requestSpy)
      requestSpy.get.should.be.called;
    })
  })
  describe("#post()", function () {
    it("should return a promise", function () {
      promisedRequest.post(createStubForRequestOptions(), { post: createStubForRequest() })
        .should.have.a.property("then")
    })
    it("should throw an error when arguments are missing", function () {
      expect(promisedRequest.post).to.throw(Error)
    })
    it("should pass url and options to request object if both present", function () {
      var testUrl = "http://www.google.com"
      var testOptions = { test: "test" }
      var mock = sinon.mock(requestMock).expects("post").withArgs(testUrl, testOptions)
      promisedRequest.post(testUrl, testOptions, requestMock)
      mock.verify()
    })
  })
  describe("#request()", function (done) {
    it("should return a promise", function () {
      expect(createStubForPromisedRequestCallback()()).to.have.a.property("then")
    })
    it("should throw an error when 2 arguments aren't present", function () {
      expect(promisedRequest.request).to.throw(Error)
    })
    it("should perform a request using the second argument", function () {
      var spy = sinon.spy();
      createStubForPromisedRequestCallback(null, spy)();
      expect(spy.called).to.be.ok;
    })
    it("should perform a request with the given options", function () {
      var options = { url: 'testurl' }
      var spy     = sinon.spy()
      createStubForPromisedRequestCallback(options, spy)();
      spy.calledWith(options).should.be.ok;
    })
    it("should reject the promise if error happend on request", function (done) {
      var promise = createStubForPromisedRequestCallback(null, function (options, cb) {
        cb(new Error, {}, {})
      })();

      promise.should.be.rejected.and.notify(done);
    })
    it("should be resolved to the response object from 'request'", function (done) {
      var response = { response: "response"}
      var promise = createStubForPromisedRequestCallback(null, function (options, cb) {
        cb(null, response, {})
      })();

      promise.should.become(response).and.notify(done)
    })
    it("should perform a request to the url if first arg is url", function () {
      var testUrl = "http://www.domain.com"
      var request = sinon.mock().withArgs(testUrl)
      promisedRequest.request(testUrl, request)
      request.verify()
    })
  })
  describe("PromisifiedRequestCommand", function () {
    var PromisifiedRequestCommand = require(moduleToTest).PromisifiedRequestCommand;
    var cmd = new PromisifiedRequestCommand({get: when.resolve});
    it("can be instantiated", function () {
      new PromisifiedRequestCommand();
    })
    it("is executable", function () {
      cmd.should.have.property("execute");
    })
    describe("#.get()", function () {
      it("returns itself", function () {
        cmd.get().should.be.equal(cmd);
      })
    })
    describe("#.execute()", function () {
      it("returns a promise", function () {
        cmd.execute().should.have.property("then");
      })
    })
  })

  function createStubForPromisedRequestCallback (options, request) {
    options = options ? options : {};
    request = request ? request : function () {};

    return function () { return promisedRequest.request(options, request); }
  }

  function createStubForRequestOptions() {
    return { options: "options"}
  }

  function createStubForRequest(callbackArguments) {
    callbackArguments = callbackArguments ? callbackArguments : new Array();
    return function (options, cb) {
      cb.apply(this, callbackArguments);
    }
  }
})