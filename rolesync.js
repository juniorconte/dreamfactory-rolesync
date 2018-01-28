#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/rolesync-init');
var create = require('./lib/rolesync-create');
var mount = require('./lib/rolesync-mount');

program
  .version(pkg.version);

program
  .command('init')
  .description('Create rolesync project and config file')
  .action(init);

program
  .command('create <role>')
  .description('Create new role from template with name')
  .action(create.template);

program
  .command('mount <environment>')
  .description('Get roles from source environment')
  .action(mount);

program
  .parse(process.argv);
