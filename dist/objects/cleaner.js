'use strict';

// Class that clears out a table within your dynamodb instance
// Accepts a table name and an array of the key's for the table
// eg. new DatabaseCleaner('tableName',['key1','key2'])

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AWS = require("aws-sdk");
var uuid = require('uuid');
var dynamo = require('serverless-dynamo-client');

var DatabaseCleaner = function () {
  function DatabaseCleaner() {
    _classCallCheck(this, DatabaseCleaner);

    this.database = dynamo.getDocumentClient({ convertEmptyValues: true });
  }

  _createClass(DatabaseCleaner, [{
    key: 'deleteAllItemsForTable',
    value: function deleteAllItemsForTable(tableName, keys, cb) {
      var params = { TableName: tableName, Select: 'ALL_ATTRIBUTES' };

      var database = this.database;

      database.scan(params, function (err, data) {
        if (!data.Items.length) {
          return cb ? cb() : undefined;
        }

        var totalCount = data.Items.length - 1; // Taking into account the zero index

        data.Items.forEach(function (item, index) {
          var params = { TableName: tableName, Key: {} };

          keys.forEach(function (key) {
            params.Key[key] = item[key];
          });

          database.delete(params, function (err, data) {
            if (err) {
              return err;
            }
            if (totalCount === index) {
              return cb ? cb() : undefined;
            }
          });
        });
      });
    }
  }]);

  return DatabaseCleaner;
}();

;

module.exports = DatabaseCleaner;