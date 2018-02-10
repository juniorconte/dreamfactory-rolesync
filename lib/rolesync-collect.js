'use strict';

var fs = require('fs');
var _ = require('underscore');
var prompt = require('prompt');
var wyaml = require('write-yaml');
var validate = require('./rolesync-validate');
var dfapi = require('./rolesync-dfapi');
var create = require('./rolesync-create');

function loadConfig(envName) {
  var config = JSON.parse(fs.readFileSync('./rolesync.json'));
  return config.env[envName];
}

function loadServices(config, token) {
  return dfapi.system(config, token, 'GET', 'service?fields=id%2Cname');
}

function loadRoles(config, token, only) {
  if (!!only) {
    return dfapi.system(config, token, 'GET', `role?related=role_service_access_by_role_id&filter=name%3D${only}`);
  } else {
    return dfapi.system(config, token, 'GET', 'role?related=role_service_access_by_role_id');
  }
}

function process(config, password, only, force) {
  dfapi.login(config, password).then(function(body) {
    var token = body.session_token;

    loadServices(config, token).then(function(body) {
      var catalog = body.resource;

      loadRoles(config, token, only).then(function(body) {
        _.each(body.resource, function(role) {
          create.mirror(role.name, role.role_service_access_by_role_id, catalog, force);
        });
      }).catch(function(err) {
        console.log(err);
      });

    }).catch(function(err) {
      console.log(err);
    });

  }).catch(function(err) {
    console.log('Error: Invalid credentials');
  });
}

module.exports = function collect(envName, options) {
  if (validate.initialized()) {
    var config = loadConfig(envName);

    if (validate.environment(config)) {
      if (options.password) {
        process(config, options.password, options.only, options.force);
      } else {
        prompt.start();
        prompt.get({
          name: 'password',
          hidden: true
        }, function(err, result) {
          process(config, result.password, options.only, options.force);
        });
      }
    } else {
      console.log(`Error: set valid configs of ${envName} on ./rolesync.json`);
    }
  } else {
    console.log("Info: run command 'init' before collect environments");
  }
};
