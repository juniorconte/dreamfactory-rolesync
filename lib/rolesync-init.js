'use strict';

var fs = require('fs');
var pkg = require('../package.json');

module.exports = function init() {
  var template = {
    "version": pkg.version,
    "env": {
      "dev": {
        "url":"",
        "key":"",
        "admin":""
      },
      "staging": {
        "url":"",
        "key":"",
        "admin":""
      }
    }
  };

  if (fs.existsSync("./roles")) {
    console.log("Warning: directory ./roles already exists and has not been modified");
  } else {
    fs.mkdir("./roles", function(error) {
      if (error) {
        console.log(`Failed: ${error}`);
      } else {
        console.log("Success: directory ./roles created");
      }
    });
  }

  if (fs.existsSync("./rolesync.json")) {
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
};
