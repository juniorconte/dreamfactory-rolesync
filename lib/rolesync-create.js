'use strict';

var fs = require('fs');
var pkg = require('../package.json');
var validate = require('./rolesync-validate');

var template = "#\n"+
  "# - service: _table/name/\n"+
  "#  ALL: ALL\n"+
  "#\n"+
  "# - service: _table/name/\n"+
  "#  GET: ALL\n"+
  "#  POST: SCRIPT\n"+
  "#\n"+
  "# - service: _table/name/\n"+
  "#   ALL: SCRIPT\n"+
  "#   GET: API\n"+
  "#   POST: API\n"+
  "#   when: id in {lookup}\n"+
  "#\n"+
  "# - service: _table/name/\n"+
  "#   ALL: SCRIPT\n"+
  "#   GET: API\n"+
  "#   POST: API\n"+
  "#   when:\n"+
  "#     - id in {lookup}\n"+
  "#     - active = 1\n"+
  "#\n"+
  "# - service: _table/name/\n"+
  "#   GET: ALL\n"+
  "#   POST: SCRIPT\n"+
  "#   PUT: SCRIPT\n"+
  "#   PATCH: SCRIPT\n"+
  "#   DELETE: SCRIPT\n"+
  "#   in:\n"+
  "#     - id = {lookup1}\n"+
  "#     - id = {lookup2}\n"+
  "#     - id = {lookup3}\n"+
  "#\n"+
  "---\n"+
  "# insert your doc here\n";

module.exports = function create(role) {
  if (validate.initialized()) {
    if (fs.existsSync(`./roles/${role}.yaml`)) {
      console.log(`Warning: Role ${role} already exists and has not been modified`);
    } else {
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
