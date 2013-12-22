var when = require("when");
var promisifier = require("promisifier");
var helpers = require("./lib/helpers");
var _ = require("underscore");

var createPromisedRequest = function (request) {

  var result = createMethodThatCallsRequestsMethod()

  result.get = createMethodThatCallsRequestsMethod("get")
  result.post = createMethodThatCallsRequestsMethod("post")

  return result;

  function createMethodThatCallsRequestsMethod(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments)
      if (!method)
        return promisifier.asyncMethodToPromiseWithArrayAsArgs(request, args)

      return promisifier.asyncMethodToPromiseWithArrayAsArgs(request[method], args)
    }
  }
}

function doGet(options, request) {
  var args = Array.prototype.slice.call(arguments)
  return promisifier.asyncMethodToPromiseWithArrayAsArgs(args.pop().get, args)
}

function doPost(options, request) {
  var args = Array.prototype.slice.call(arguments)
  var method =args.pop().post

  return promisifier.asyncMethodToPromiseWithArrayAsArgs(method, args)
}

function doRequest(options, request) {
  var args = Array.prototype.slice.call(arguments)
  if (arguments.length < 2)
    throw new Error("ARGUMENTS_ARE_MISSING");

  return promisifier.asyncMethodToPromiseWithArrayAsArgs(args.pop(), args)
}

function doRequestWithUrlAndMethod(url, options, request, method) {
  var args = Array.prototype.slice.call(arguments)
  if (isUrlArgPresent(args)) {
    options.url = args.shift();
  } else {
    options = url;
  }

  options.method = args.pop();

  return doRequest.apply(this, args);

  function isUrlArgPresent(args) {
    return args.length == 4
  }
}

var PromisifiedRequestCommand = function () { helpers.AbstractDelayedCallCommand.constructor.apply(this, arguments)};
_.extend(PromisifiedRequestCommand.prototype, helpers.AbstractDelayedCallCommand, {
  get: function () { this.saveCall.apply(this, this.combineMethodsIntoArguments("get", arguments)); return this; },
  post: function () { this.saveCall.apply(this, this.combineMethodsIntoArguments("post", arguments)); return this; }
});

module.exports.create   = createPromisedRequest;
module.exports.get      = doGet;
module.exports.post     = doPost;
module.exports.request  = doRequest;

module.exports.PromisifiedRequestCommand = PromisifiedRequestCommand;