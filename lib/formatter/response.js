"use strict";

/*
 * Restful API response formatter
 *
 */

const shortId = require('shortid');

function Result(data, errCode, errMsg) {
  this.success = (typeof errCode === undefined || typeof errCode === "undefined");

  this.data = data || {};

  if (!this.success) {
    this.err = {
      code: errCode,
      msg: errMsg
    };
  }

  // Check if response has success
  this.isSuccess = function () {
    return this.success;
  };

  // Check if response is not success. More often not success is checked, so adding a method.
  this.isFailure = function () {
    return !this.isSuccess();
  };

  // Format data to hash
  this.toHash = function () {
    var s = {};
    if (this.success) {
      s.success = true;
      s.data = this.data;
    } else {
      s.success = false;
      if ( this.data instanceof Object && Object.keys( this.data ).length > 0 ) {
        //Error with data case.
        s.data = this.data;
      }
      s.err = this.err;
    }

    return s;
  };

  // Render final error or success response
  this.renderResponse = function (res, status) {
    status = status || 200;
    return res.status(status).json(this.toHash());
  };
}

const responseHelper = {

  // Generate success response object
  successWithData: function (data) {
    return new Result(data);
  },

  // Generate error response object
  error: function(errCode, errMsg, errPrefix) {
    errCode = 'ost_pricer(' + errCode + ":" + shortId.generate() + ')';
    if (errPrefix) {
      errCode = errPrefix + "*" + errCode;
    }
    return new Result({}, errCode, errMsg);
  },

  // Generate error response object
  errorWithData: function (data, errCode, errMsg, errPrefix) {
    errCode = 'ost_pricer(' + errCode + ":" + shortId.generate() + ')';
    if (errPrefix) {
      errCode = errPrefix + "*" + errCode;
    }
    return new Result(data, errCode, errMsg);
  },

};

module.exports = responseHelper;