#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/rolesync-init');
var create = require('./lib/rolesync-create');
var collect = require('./lib/rolesync-collect');

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
  .command('collect <environment>')
  .description('Generate roles from remote source environment')
  .action(collect);

program
  .command('*')
  .action(function(command) {
    console.log('The command "%s" is not valid\nExecute "rolesync --help" to view the complete list of commands', command);
  });

program
  .parse(process.argv);
