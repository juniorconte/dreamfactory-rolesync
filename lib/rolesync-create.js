'use strict';

var fs = require('fs');
var _ = require('underscore');
var wyaml = require('write-yaml');
var replace = require('replace-in-file');
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

function template(name) {
  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${name}.yaml`)) {
      console.log(`Warning: Role ${name} already exists and has not been modified`);
    } else {
      var data = [
        {
          "service": "_table/name/",
          "ALL": "ALL"
        }, {
          "service": "_table/name/",
          "GET": "ALL",
          "POST": "SCRIPT"
        }, {
          "service": "_table/name/",
          "ALL": "SCRIPT",
          "GET": "API",
          "POST": "API",
          "when": "id in {lookup}"
        }, {
          "service": "_table/name/",
          "ALL": "SCRIPT",
          "GET": "API",
          "POST": "API",
          "when": [
            "id in {lookup}",
            "active = 1"
          ]
        }, {
          "service": "_table/name/",
          "GET": "ALL",
          "POST": "SCRIPT",
          "PUT": "SCRIPT",
          "PATCH": "SCRIPT",
          "DELETE": "SCRIPT",
          "in": [
            "id = {lookup1}",
            "id = {lookup2}",
            "id = {lookup3}"
          ]
        }
      ];

      persist(name, data);
    }
  } else {
    console.log("Info: run command 'init' before create new role");
  }
}

function mirror(name, endpoints, catalog) {
  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${name}.yaml`)) {
      console.log(`Warning: Role ${name} already exists and has not been modified`);
    } else {
      var data = _.chain(endpoints)
        .map(function(endpoint) {
          var service = _.findWhere(catalog, { id:endpoint.service_id });
          var structure = {};

          // service_id: 8,
          // component: '*',
          // verb_mask: 31,
          // requestor_mask: 1,
          // filters: [],
          // filter_op: 'AND',

          structure[service.name] = endpoint.component;
          structure['GET'] = 'API';
          structure['POST'] = 'API';
          structure['PUT'] = 'API';
          structure['PATCH'] = 'API';
          structure['DELETE'] = 'API';

          if (endpoint.filters.length) {
            if (endpoint.filter_op === 'AND') {
              if (endpoint.filters.length > 1) {
                structure['when'] = endpoint.filters;
              } else {
                var filter = _.first(endpoint.filters);
                structure['when'] = `${filter.name} ${filter.operator} ${filter.value}`;
              }
            } else {
              structure['in'] = _.map(endpoint.filters, function(filter) {
                return `${filter.name} ${filter.operator} ${filter.value}`;
              });
            }
          }

          return structure;
        })
        .sortBy(function(endpoint) {
          return _.keys(endpoint)[0];
        })
        .value();
    }

    persist(name, data);
  } else {
    console.log("Info: run command 'init' before create new role");
  }
}

module.exports = {
  template: template,
  mirror: mirror
};
