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
  .description('Create new role with name')
  .action(create);

program
  .command('mount <environment>')
  .option('-o, --only <role>', 'only specific role')
  .description('Get roles from source environment')
  .action(mount);

program
  .parse(process.argv);
