'use strict';

var fs = require('fs');
var _ = require('underscore');

function role(envName, name) {
  var pattern = require('./rolesync-pattern');
  var ryaml = require('read-yaml');

  ryaml(`./roles/${name}.yaml`, function(err, data) {
    if (err) {
      throw err;
    } else {
      var log = [];

      _.each(data, function(rule) {
        var service = Object.keys(rule)[0];
        var invalidService = pattern.service(envName, rule);

        var withoutKeys = pattern.keys.without(rule);
        var conflictKeys = pattern.keys.conflict(rule);
        var invalidKeys = pattern.keys.invalid(envName, rule);

        var conflictActions = pattern.actions.conflict(rule);
        var invalidActions = pattern.actions.invalid(rule);

        var conflictFrom = pattern.from.conflict(rule);
        var invalidFrom = pattern.from.invalid(rule);

        var invalidFilters = pattern.filters(rule);

        if (invalidService) {
          log.push(`  🔸 Invalid SERVICE ${service} on ${rule[service]}`);
        }

        if (withoutKeys.length) {
          log.push(`  🔸 Required KEYS (${withoutKeys}) on ${service} ${rule[service]}`);
        }

        if (conflictKeys.length) {
          log.push(`  🔸 Conflict KEYS (${conflictKeys}) on ${service} ${rule[service]}`);
        }

        if (invalidKeys.length) {
          log.push(`  🔸 Invalid KEYS (${invalidKeys}) on ${service} ${rule[service]}`);
        }

        if (conflictActions.length) {
          log.push(`  🔸 Confict ACTIONS 'all' with (${conflictActions}) on ${service} ${rule[service]}`);
        }

        if (invalidActions.length) {
          log.push(`  🔸 Invalid ACTIONS (${invalidActions}) on ${service} ${rule[service]}`);
        }

        if (conflictFrom.length) {
          log.push(`  🔸 Confict FROM 'all' with (${conflictFrom}) on ${service} ${rule[service]}`);
        }

        if (invalidFrom.length) {
          log.push(`  🔸 Invalid FROM (${invalidFrom}) on ${service} ${rule[service]}`);
        }

        if (invalidFilters.length) {
          log.push(`  🔸 Invalid FILTERS on ${service} ${rule[service]}`);

          _.each(invalidFilters, function(filter, index) {
            log.push(`    ${filter}`);
          });
        }
      });

      log.unshift(`${log.length ? '🔴 ' : '✅ '} ${name}`);

      var output = JSON.stringify(log, null, 2)
        .replace(/\[|\]|\"/gm, '')
        .replace(/,\n/gm, '\n')
        .replace(/^\n/gm, '')
        .replace(/^  /gm, '')
        .replace(/\n$/g, '');

      console.log(output);
    }
  });
}

function roles(envName, options) {
  if (!!options.only) {
    if (exists(options.only)) {
      role(envName, options.only);
    } else {
      console.log(`Error: Role ${options.only} does not exist`);
    }
  } else {
    fs.readdir('./roles', function(err, files) {
      _.each(files, function(file) {
        if (_.last(file.split('.')) === 'yaml') {
          role(envName, _.first(file.split('.')));
        }
      });
    });
  }
}

function exists(name) {
  return fs.existsSync(`./roles/${name}.yaml`);
}

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
  var validator = require('validator');

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
  role: role,
  roles: roles,
  exists: exists,
  rolesDir: rolesDir,
  configFile: configFile,
  initialized: initialized,
  environment: environment
};
