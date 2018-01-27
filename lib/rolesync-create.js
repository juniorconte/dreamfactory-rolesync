'use strict';

var fs = require('fs');
var pkg = require('../package.json');
var validate = require('./rolesync-validate');

module.exports = function create(role) {

  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${role}.yaml`)) {
      console.log(`Warning: Role ${role} already exists and has not been modified`);
    } else {
      var template = fs.readFileSync("./templates/role.yaml");

      fs.writeFile(`./roles/${role}.yaml`, template, function(error) {
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
