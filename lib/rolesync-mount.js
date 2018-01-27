'use strict';

var fs = require('fs');
var wyaml = require('write-yaml');
var validate = require('./rolesync-validate');
var session = require('./rolesync-session');

function load(envName) {
  var config = JSON.parse(fs.readFileSync('./rolesync.json'));
  return config.env[envName];
}

module.exports = function mount(envName, options) {
  if (validate.initialized()) {
    var config = load(envName);

    if (validate.environment(config)) {
      console.log("Info: all is valid :)");
    } else {
      console.log(`Error: set valid configs of ${envName} on ./rolesync.json`);
    }
  } else {
    console.log("Info: run command 'init' before mount environments");
  }
};
