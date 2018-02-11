'use strict';

var _ = require('underscore');
var catalog = require('./rolesync-catalog');

var keys = {
  required: [
    'actions',
    'from'
  ],
  optional: [
    'every',
    'some'
  ]
};

var actions = [
  'all',
  'get',
  'post',
  'put',
  'patch',
  'delete'
];

var from = [
  'all',
  'api',
  'script'
];

var operators = [
  '=',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  'in',
  'not in',
  'starts with',
  'ends with',
  'contains',
  'is null',
  'is not nul'
];

function invalidService(envName, rule) {
  var services = _.pluck(catalog.services(envName), 'name');
  return services.indexOf(Object.keys(rule)[0]) === -1;
}

function withoutKeys(rule) {
  return _.without.apply(this, [keys.required].concat(Object.keys(rule)));
}

function conflictKeys(rule) {
  return _.intersection(keys.optional, Object.keys(rule)).length === keys.optional.length && keys.optional;
}

function invalidKeys(envName, rule) {
  var services = _.pluck(catalog.services(envName), 'name');
  var acceptable = _.union(keys.required, keys.optional);

  return _.chain(Object.keys(rule))
    .reject(function(key, index) {
      return !index || services.indexOf(key) > -1;
    })
    .difference(acceptable)
    .value();
}

function conflictActions(rule) {
  var current = rule.actions.split(',');
  return current.indexOf('all') > -1 && current.length > 1 && current;
}

function invalidActions(rule) {
  var current = rule.actions.split(',');
  return _.difference(current, actions);
}

function conflictFrom(rule) {
  var current = rule.from.split(',');
  return current.indexOf('all') > -1 && current.length > 1 && current;
}

function invalidFrom(rule) {
  var current = rule.from.split(',');
  return _.difference(current, from);
}

function invalidOperators(rule) {
}

module.exports = {
  service: invalidService,
  keys: {
    without: withoutKeys,
    conflict: conflictKeys,
    invalid: invalidKeys
  },
  actions: {
    conflict: conflictActions,
    invalid: invalidActions
  },
  from: {
    conflict: conflictFrom,
    invalid: invalidFrom
  },
  operators: invalidOperators
};
