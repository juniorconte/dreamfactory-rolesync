'use strict';

var exec = require('child_process').exec;
var pkg = require('../package.json');
var rolesync = './rolesync.js';
require('should');

describe('DreamFactory RoleSync', function() {
  it('Should return version of rolesync', function(done) {
    exec(rolesync + ' --version', function(err, stdout, stderr) {
      if (err) throw err;
      stdout.replace('\n', '').should.be.equal(pkg.version);
      done();
    });
  });
});
