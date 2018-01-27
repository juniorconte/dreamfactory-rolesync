'use strict';

var fs = require('fs');
var request = require('request');

function login(user, password) {
  console.log(user, password);
};

module.exports = {
  login: login
};
