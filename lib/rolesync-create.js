'use strict';

var fs = require('fs');
var _ = require('underscore');
var wyaml = require('write-yaml');
var replace = require('replace-in-file');
var pkg = require('../package.json');
var bitmask = require('./rolesync-bitmask');
var validate = require('./rolesync-validate');

function persist(name, content) {
  wyaml(`./roles/${name}.yaml`, content, function(error) {
    if (error) {
      console.log(`Failed: ${error}`);
    } else {
      replace({
        files: `./roles/${name}.yaml`,
        from: [
          '-',
          /\n-/g,
          /'/g
        ],
        to: [
          `# rolesync version ${pkg.version}\n-`,
          '\n\n-',
          ''
        ],
      }).then(function() {
        console.log(`Success: Role ${name} created`);
      }).catch(function(error) {
        console.error(`Error: ${error}`);
      });
    }
  });
}

function sample(name) {
  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${name}.yaml`)) {
      console.log(`Warning: Role ${name} already exists and has not been modified`);
    } else {
      var template = [
        {
          service: 'all',
          actions: 'all',
          from: 'all'
        }, {
          other: '_table/foo/',
          actions: 'all',
          from: 'all'
        }, {
          other: '_table/bar/',
          actions: 'post',
          from: 'all'
        }, {
          other: '_table/bar/*',
          actions: 'get',
          from: 'all'
        }, {
          other: '_table/baz/',
          actions: 'get,post',
          from: 'all',
          every: 'id in {lookup}'
        }, {
          whatever: '_table/a/',
          actions: 'get',
          from: 'api',
          every: [
            'id in {lookup}',
            'active = 1'
          ]
        }, {
          whatever: '_table/b/',
          actions: 'get,post,put,patch',
          from: 'api',
          some: [
            'id = {lookup1}',
            'id = {lookup2}',
            'id = {lookup3}'
          ]
        }
      ];

      persist(name, template);
    }
  } else {
    console.log("Info: run command 'init' before create new role");
  }
}

function mirror(name, rules, catalog) {
  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${name}.yaml`)) {
      console.log(`Warning: Role ${name} already exists and has not been modified`);
    } else {
      var data = _.chain(rules)
        .map(function(rule) {
          var service = _.findWhere(catalog, { id:rule.service_id });
          var verbs = bitmask.flags('verb', rule.verb_mask);
          var allVerbs = !_.chain(bitmask.verbs()).difference(verbs).some().value();
          var requestors = bitmask.flags('requestor', rule.requestor_mask);
          var allRequestors = !_.chain(bitmask.requestors()).difference(requestors).some().value();
          var access = {};

          access[service.name] = rule.component === '*' ? 'all' : rule.component;
          access['actions'] = allRequestors ? 'all' : verbs.toString();
          access['from'] = allRequestors ? 'all' : requestors.toString();

          if (rule.filters.length) {
            if (rule.filter_op === 'AND') {
              if (rule.filters.length > 1) {
                 access['every'] = _.map(rule.filters, function(filter) {
                  return `${filter.name} ${filter.operator} ${filter.value}`.trim();
                });
              } else {
                var filter = _.first(rule.filters);
                access['every'] = `${filter.name} ${filter.operator} ${filter.value}`.trim();
              }
            } else {
              access['some'] = _.map(rule.filters, function(filter) {
                return `${filter.name} ${filter.operator} ${filter.value}`.trim();
              });
            }
          }

          return access;
        })
        .sortBy(function(rule) {
          return _.keys(rule)[0];
        })
        .value();

      persist(name, data);
    }
  } else {
    console.log("Info: run command 'init' before create new role");
  }
}

module.exports = {
  sample: sample,
  mirror: mirror
};
