'use strict';

var fs = require('fs');

function initialized() {
  return fs.existsSync("./roles") && fs.existsSync("./rolesync.json");
};

module.exports = {
  initialized: initialized
};
