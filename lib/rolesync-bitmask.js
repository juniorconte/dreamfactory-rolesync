'use strict';

var _ = require('underscore');

var reference = {
  requestor: {
    api: 1,
    script: 2
  },
  verb: {
    get: 1,
    post: 2,
    put: 4,
    patch: 8,
    delete: 16
  }
};

function mask(type, flags) {
  return _.reduce(flags, function(memo, flag) {
    return memo + reference[type][flag];
  }, 0);
}

function flags(type, mask) {
  return _.reduce(reference[type], function(memo, value, flag) {
    if (mask & value) memo.push(flag);
    return memo;
  }, []);
}

function requestors() {
  return _.keys(reference.requestor);
}

function verbs() {
  return _.keys(reference.verb);
}

module.exports = {
  verbs: verbs,
  requestors: requestors,
  flags: flags,
  mask: mask
};
