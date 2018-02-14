'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class that clears out a table within your dynamodb instance
// Accepts a table name and an array of the key's for the table
// eg. new DatabaseCleaner(dynamo).deleteAllItemsForTable('tableName',['key1','key2'])

var DatabaseCleaner = function () {
  function DatabaseCleaner(dynamo) {
    _classCallCheck(this, DatabaseCleaner);

    this.dynamo = dynamo;
    this.database = this.dynamo.getDocumentClient({ convertEmptyValues: true });
  }

  _createClass(DatabaseCleaner, [{
    key: '_scan',
    value: function _scan(tableName) {
      var _this = this;

      var params = { TableName: tableName, Select: 'ALL_ATTRIBUTES' };

      return new Promise(function (resolve, reject) {
        _this.database.scan(params, function (err, data) {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    }
  }, {
    key: '_delete',
    value: function _delete(tableName, item, keys) {
      var _this2 = this;

      var params = { TableName: tableName, Key: {} };
      keys.forEach(function (key) {
        params.Key[key] = item[key];
      });

      return new Promise(function (resolve, reject) {
        _this2.database.delete(params, function (err, data) {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    }
  }, {
    key: 'deleteAllItemsForTable',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tableName, keys, cb) {
        var _this3 = this;

        var data, totalCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._scan(tableName).catch(function (err) {
                  throw err;
                });

              case 2:
                data = _context.sent;

                if (data.Items.length) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', cb ? cb() : undefined);

              case 5:
                totalCount = data.Items.length - 1; // Taking into account the zero index

                data.Items.forEach(function (item, index) {
                  _this3._delete(tableName, item, keys).then(function (data) {
                    if (totalCount === index) {
                      return cb ? cb() : undefined;
                    }
                  }).catch(function (err) {
                    throw err;
                  });
                });

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function deleteAllItemsForTable(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return deleteAllItemsForTable;
    }()
  }]);

  return DatabaseCleaner;
}();

;

module.exports = DatabaseCleaner;