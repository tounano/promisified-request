
exports.AbstractDelayedCallCommand = {
  constructor: function (host) {
    this.host = host;
  },
  saveCall: function (method) {
    var args = Array.prototype.slice.call(arguments);
    var that = this;
    var method = args.shift();
    this.executable = function () { return that.host[method].apply(that.host, args); };
    return this;
  },
  execute: function () {
    return this.executable();
  },
  combineMethodsIntoArguments: function (method, args) {
    args = Array.prototype.slice.call(args);
    args.unshift(method);
    return args;
  }
};