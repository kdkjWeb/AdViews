'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.101.51:8080/"'
  // API_ROOT: '"http://39.96.11.70:8080/travel"'

})
