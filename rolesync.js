#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/rolesync-init');
var create = require('./lib/rolesync-create');
var catalog = require('./lib/rolesync-catalog');
var collect = require('./lib/rolesync-collect');
var validate = require('./lib/rolesync-validate');

program
  .version(pkg.version);

program
  .command('init')
  .description('Create rolesync project and config file')
  .action(init);

program
  .command('create <role>')
  .description('Create new role with name from sample template')
  .action(create.sample);

program
  .command('catalog <environment>')
  .option('-p, --password [type]', 'Performs with the password specified in the command')
  .description('Create local catalog from remote services of environment')
  .action(catalog.command);

program
  .command('collect <environment>')
  .option('-p, --password [type]', 'Performs with the password specified in the command')
  .option('-o, --only [role]', 'Downloads only specified role')
  .option('-f, --force', 'Overwrites locally if already exist')
  .description('Create roles from remote source environment')
  .action(collect);

program
  .command('validate <environment>')
  .option('-o, --only [role]', 'Validate only specified role')
  .description('Validate roles structure')
  .action(validate.roles);

program
  .command('*')
  .action(function(command) {
    console.log('The command "%s" is not valid\nExecute "rolesync --help" to view the complete list of commands', command);
  });

program
  .parse(process.argv);
