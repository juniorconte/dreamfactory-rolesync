'use strict';

var fs = require('fs');
var _ = require('underscore');
var wyaml = require('write-yaml');
var replace = require('replace-in-file');
var bitmask = require('./rolesync-bitmask');
var validate = require('./rolesync-validate');

function persist(name, content) {
  wyaml(`./roles/${name}.yaml`, content, function(error) {
    if (error) {
      console.log(`Failed: ${error}`);
    } else {
      replace({
        files: `./roles/${name}.yaml`,
        from: /'/g,
        to: '',
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
          full: 'any'
        }, {
          other: '_table/foo/',
          full: 'any'
        }, {
          other: '_table/bar/',
          post: 'any'
        }, {
          other: '_table/bar/*',
          get: 'any'
        }, {
          other: '_table/baz/',
          get: 'any',
          post: 'script',
          when: 'id in {lookup}'
        }, {
          whatever: '_table/a/',
          get: 'api',
          when: [
            'id in {lookup}',
            'active = 1'
          ]
        }, {
          whatever: '_table/b/',
          get: 'any',
          post: 'script',
          put: 'script',
          patch: 'script',
          delete: 'script',
          in: [
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

          if (allVerbs) {
            access['full'] = allRequestors ? 'any' : requestors.toString();
          } else {
            _.each(verbs, function(verb) {
              access[verb] = allRequestors ? 'any' : requestors.toString();
            });
          }

          if (rule.filters.length) {
            if (rule.filter_op === 'AND') {
              if (rule.filters.length > 1) {
                access['when'] = rule.filters;
              } else {
                var filter = _.first(rule.filters);
                access['when'] = `${filter.name} ${filter.operator} ${filter.value}`;
              }
            } else {
              access['in'] = _.map(rule.filters, function(filter) {
                return `${filter.name} ${filter.operator} ${filter.value}`;
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
