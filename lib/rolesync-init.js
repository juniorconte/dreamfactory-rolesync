'use strict';

var fs = require('fs');
var pkg = require('../package.json');

module.exports = function init() {
  var base = {
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
      },
      "production": {
        "url":"",
        "key":"",
        "admin":""
      }
    }
  };

  fs.writeFile("./rolesync.json", JSON.stringify(base, null, 2), function(error) {
    if (error) throw error;
    console.log("rolesync.json created SUCCESFUL");
  });
};
