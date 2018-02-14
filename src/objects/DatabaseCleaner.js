'use strict';

// Class that clears out a table within your dynamodb instance
// Accepts a table name and an array of the key's for the table
// eg. new DatabaseCleaner(dynamo).deleteAllItemsForTable('tableName',['key1','key2'])

class DatabaseCleaner {
  constructor(dynamo){
    this.dynamo = dynamo;
    this.database = this.dynamo.getDocumentClient({convertEmptyValues: true});
  }

  _scan(tableName) {
    let params = { TableName: tableName, Select: 'ALL_ATTRIBUTES' };

    return new Promise((resolve, reject) => {
      this.database.scan(params, function(err, data) {
        if (err) { reject(err); }
        resolve(data);
      })
    })
  }

  _delete(tableName, item, keys) {
    let params = { TableName: tableName, Key: {} };
    keys.forEach((key) => { params.Key[key] = item[key]; });

    return new Promise((resolve, reject) => {
      this.database.delete(params, function(err, data) {
        if (err) { reject(err); }
        resolve(data)
      })
    })
  }

  async deleteAllItemsForTable(tableName, keys, cb) {
    let data = await this._scan(tableName).catch(err => {throw err});

    if(!data.Items.length) { return (cb ? cb() : undefined); }
    let totalCount = data.Items.length - 1; // Taking into account the zero index

    data.Items.forEach((item, index) => {
      this._delete(tableName, item , keys).then(data => {
        if (totalCount === index) { return (cb ? cb() : undefined); }
      }).catch(err => {throw err});
    })
  }
};

module.exports = DatabaseCleaner;