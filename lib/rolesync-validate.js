'use strict';

var fs = require('fs');
var _ = require('underscore');
var validator = require('validator');

function rolesDir() {
  return fs.existsSync('./roles');
}

function configFile() {
  return fs.existsSync('./rolesync.json');
}

function initialized() {
  return rolesDir() && configFile();
}

function environment(config) {
  return _.every(['url','key','login'], function(key) {
    return !!config[key];
  }) && validator.isURL(config.url, {
    protocols: ['http','https'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true
  });
}

module.exports = {
  rolesDir: rolesDir,
  configFile: configFile,
  initialized: initialized,
  environment: environment
};
