#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/rolesync-init')

program.version(pkg.version);

program
  .command('init')
    .description('Create new rolesync config file')
    .action(init);

program.parse(process.argv);
