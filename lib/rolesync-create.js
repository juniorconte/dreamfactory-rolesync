'use strict';

var fs = require('fs');
var wyaml = require('write-yaml');
var validate = require('./rolesync-validate');

var template = [
  {
    "service": "_table/name/",
    "ALL": "ALL"
  },
  {
    "service": "_table/name/",
    "GET": "ALL",
    "POST": "SCRIPT"
  },
  {
    "service": "_table/name/",
    "ALL": "SCRIPT",
    "GET": "API",
    "POST": "API",
    "when": "id in {lookup}"
  },
  {
    "service": "_table/name/",
    "ALL": "SCRIPT",
    "GET": "API",
    "POST": "API",
    "when": [
      "id in {lookup}",
      "active = 1"
    ]
  },
  {
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

module.exports = function create(role) {
  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${role}.yaml`)) {
      console.log(`Warning: Role ${role} already exists and has not been modified`);
    } else {
      wyaml(`./roles/${role}.yaml`, template, function(error) {
        if (error) {
          console.log(`Failed: ${error}`);
        } else {
          console.log(`Success: Role ${role} created`);
        }
      });
    }
  } else {
    console.log("Info: run command 'init' before create new role");
  }
};
