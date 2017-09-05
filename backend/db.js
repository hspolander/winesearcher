var mysql = require('mysql')
  , async = require('async')

var PRODUCTION_DB = 'winerewiew'
  , TEST_DB = 'app_test_database'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'


exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'wineuser',
    password: 'chardonnay',
    database: 'winereview'
  })

  state.mode = mode
  done()
}

exports.get = function() {
  return state.pool
}