'use strict';

var fs = require('fs');
var _ = require('underscore');
var dfapi = require('./rolesync-dfapi');

function loadConfig(envName) {
  var config = JSON.parse(fs.readFileSync('./rolesync.json'));
  return config.env[envName];
}

function loadRoles(config, token, only) {
  if (!!only) {
    return dfapi.system(config, token, 'GET', `role?related=role_service_access_by_role_id&filter=name%3D${only}`);
  } else {
    return dfapi.system(config, token, 'GET', 'role?related=role_service_access_by_role_id');
  }
}

function process(envName, config, password, only, force) {
  var create = require('./rolesync-create');
  var catalog = require('./rolesync-catalog');

  dfapi.login(config, password).then(function(body) {
    var token = body.session_token;

    catalog.pipeline(envName, config, token, function() {
      loadRoles(config, token, only).then(function(body) {
        _.each(body.resource, function(role) {
          create.mirror(envName, role.name, role.role_service_access_by_role_id, force);
        });
      }).catch(function(err) {
        console.log(err);
      });
    });

  }).catch(function(err) {
    console.log('Error: Invalid credentials');
  });
}

module.exports = function collect(envName, options) {
  var prompt = require('prompt');
  var validate = require('./rolesync-validate');

  if (validate.initialized()) {
    var config = loadConfig(envName);

    if (validate.environment(config)) {
      if (options.password) {
        process(envName, config, options.password, options.only, options.force);
      } else {
        prompt.start();
        prompt.get({
          name: 'password',
          hidden: true
        }, function(err, result) {
          process(envName, config, result.password, options.only, options.force);
        });
      }
    } else {
      console.log(`Error: set valid configs of ${envName} on ./rolesync.json`);
    }
  } else {
    console.log("Info: run command 'init' before collect environments");
  }
};
