'use strict';

var fs = require('fs');
var _ = require('underscore');
var prompt = require('prompt');
var validate = require('./rolesync-validate');
var dfapi = require('./rolesync-dfapi');

function loadConfig(envName) {
  var config = JSON.parse(fs.readFileSync('./rolesync.json'));
  return config.env[envName];
}

function loadServices(config, token) {
  return dfapi.system(config, token, 'GET', 'service?fields=id%2Cname');
}

function persist(envName, services, showLog) {
  var clean = _.map(services, function(service) {
    return {
      id: service.id,
      name: service.name
    };
  });

  fs.writeFile(`./roles/catalogs/${envName}.json`, JSON.stringify(clean, null, 2), function(error) {
    if (showLog) {
      if (error) {
        console.log(`Failed: ${error}`);
      } else {
        console.log(`Success: catalog ${envName} created`);
      }
    }
  });
}

function services(envName) {
  return JSON.parse(fs.readFileSync(`./roles/catalogs/${envName}.json`));
}

function command(envName, options) {
  if (validate.initialized()) {
    var config = loadConfig(envName);

    function request(password) {
      dfapi.login(config, password).then(function(body) {
        var token = body.session_token;

        loadServices(config, token).then(function(body) {
          persist(envName, body.resource, true);
        }).catch(function(err) {
          console.log(err);
        });

      }).catch(function(err) {
        console.log('Error: Invalid credentials');
      });
    }

    if (validate.environment(config)) {
      if (options.password) {
        request(options.password);
      } else {
        prompt.start();
        prompt.get({
          name: 'password',
          hidden: true
        }, function(err, result) {
          request(result.password);
        });
      }
    } else {
      console.log(`Error: set valid configs of ${envName} on ./rolesync.json`);
    }
  } else {
    console.log("Info: run command 'init' before catalog environments");
  }
}

function pipeline(envName, config, token, callback) {
  loadServices(config, token).then(function(body) {
    persist(envName, body.resource, false);
    callback();
  });
}

module.exports = {
  command: command,
  pipeline: pipeline,
  services: services
};
