#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/rolesync-init')
var create = require('./lib/rolesync-create')

program.version(pkg.version);

program
  .command('init')
    .description('Create rolesync project and config file')
    .action(init);

program
  .command('create <role>')
    .description('Create new role with name')
    .action(create);

program.parse(process.argv);
