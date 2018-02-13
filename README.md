# Installation
* `npm install --save git+ssh://git@github.com/Vin65/npm-dynamo-db-cleaner.git#master`

# Usage

### `DatabaseCleaner`
* Add `const DatabaseCleaner = require('npm-dynamo-db-cleaner);` to make `DatabaseCleaner` constructor available to your code.

* To create a new `DatabaseCleaner` instance, call `new DatabaseCleaner(dynamo)
  * dynamo should be a serverless-dynamo-client object https://www.npmjs.com/package/serverless-dynamodb-client

* To erase some records from a test dynamo database use the `DatabseCleaner.delteAllItemsForTable(tableName, Keys, cb)`
  * tableName is the name of the dynamo table (Required)
  * keys is an array with the [parition keys](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-Key) (Required)
  * the cb(callback) is a function to be called after, usually a done() for asynchronous mocha tests. (Optional)
