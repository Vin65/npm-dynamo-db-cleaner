'use strict';

// Class that clears out a table within your dynamodb instance
// Accepts a table name and an array of the key's for the table
// eg. new DatabaseCleaner('tableName',['key1','key2'])

const AWS = require("aws-sdk");
const uuid = require('uuid');
const dynamo = require('serverless-dynamo-client');

class DatabaseCleaner {
  constructor(){
    this.database = dynamo.getDocumentClient({convertEmptyValues: true});
  }

  deleteAllItemsForTable(tableName, keys, cb){
    let params = { TableName: tableName, Select: 'ALL_ATTRIBUTES' };

    let database = this.database;

    return database.scan(params, function(err, data) {
      if(!data.Items.length) { return (cb ? cb() : undefined); }

      let totalCount = data.Items.length - 1; // Taking into account the zero index

      data.Items.forEach(function(item, index) {
        let params = { TableName: tableName, Key: {} };

        keys.forEach((key) => { params.Key[key] = item[key]; });

        database.delete(params, function(err, data) {
          if (err){ return err; }
          if (totalCount === index) { return (cb ? cb() : undefined); }
        });
      });
    });
  };
};

module.exports = DatabaseCleaner;