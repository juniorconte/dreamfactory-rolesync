'use strict';

var request = require('request-promise');

function login(config, password) {
  return request({
    method: 'POST',
    uri: `${config.url}/system/admin/session`,
    headers: {
      'Content-Type': 'application/json',
      'X-DreamFactory-API-Key': config.key
    },
    body: {
      email: config.login,
      password: password
    },
    json: true
  });
}

function system(config, token, method, uri, body) {
  return request({
    method: method,
    uri: `${config.url}/system/${uri}`,
    headers: {
      'Content-Type': 'application/json',
      'X-DreamFactory-API-Key': config.key,
      'X-DreamFactory-Session-Token': token
    },
    body: body,
    json: true
  });
}

module.exports = {
  login: login,
  system: system
};
