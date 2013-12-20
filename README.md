Promisified Request
===================

This simple module wraps Mikeal's `request` module. Instead of calling Async callbacks on errors or on response, this module
will return a Promise.

## Installation

    $ npm install promisified-request

or simply add `promisified-request` in your package.json.

## Functional Usage

You can use this module both in a functional and an OO way.

### Methods

So far this module implements the following methods:

* `request` - Perform whatever request you want. You'll have to specify the method in `options`.
* `get` - Performs a get request.
* `post` - Perform a post request.

### Arguments

The syntax of `promisified-request` is similar to the syntax of the original `request`. The only difference is the last
argument which in that case should be something that implements the `request` interface.

Here are the ways to use `promisified-request` methods:

* `method(url, options, request)`
* `method(options, request)`

### Example

Here is a demonstration of how to use `promisified-request` with a Cookie Jar.

```javascript
var request  = require("request");
var pRequest = require("promisified-request");

request = request.defaults({jar: true});

var promise = pRequest.get("http://www.google.com", { followAllRedirects: true }, request);

promise.then(console.log);
```

## Object Oriented Usage

You can use `promisified-request` as an object with instance, so you won't need to pass `request` object each time.

### Creating Instance

In order to create and instance you should use the method `create`. This method takes `request` as an argument.

### Methods

* `pRequest(url, options)` - The method should be specified in `options`.
* `pRequest.get(url, options)`
* `pRequest.post(url, options)`

### Arguments

You can use `url` or `options` or both.

### Example

```javascript
var request  = require("request");
var pRequest = require("promisified-request");

request = request.defaults({jar: true});
pRequest = pRequest.create(request);

var promise = pRequest.get("http://www.google.com", { followAllRedirects: true });

promise.then(console.log);
```
