'use strict';

var fs = require('fs');
var pkg = require('../package.json');
var validate = require('./rolesync-validate');

module.exports = function init() {
  var template = {
    "version": pkg.version,
    "env": {
      "dev": {
        "url":"",
        "key":"",
        "login":""
      },
      "staging": {
        "url":"",
        "key":"",
        "login":""
      }
    }
  };

  if (validate.rolesDir()) {
    console.log("Warning: directory ./roles already exists and has not been modified");
  } else {
    fs.mkdir("./roles", function(error) {
      if (error) {
        console.log(`Failed: ${error}`);
      } else {
        fs.mkdir("./roles/catalogs", function(error) {
          if (error) {
            console.log(`Failed: ${error}`);
          } else {
            console.log("Success: directory ./roles created");
          }
        });
      }
    });
  }

  if (validate.configFile()) {
    console.log("Warning: file rolesync.json already exists and has not been modified");
  } else {
    fs.writeFile("./rolesync.json", JSON.stringify(template, null, 2), function(error) {
      if (error) {
        console.log(`Failed: ${error}`);
      } else {
        console.log("Success: file rolesync.json created");
      }
    });
  }

  if (fs.existsSync('./.gitignore')) {
    fs.appendFileSync('./.gitignore', '\n# rolesync\n/roles/catalogs\n');
  }
};
