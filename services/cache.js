const mongoose = require('mongoose');
const redis = require('redis');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
const util = require('util');

client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec; //saving original exec

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this; // makes the function chainable
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    console.log('reading from Mongo -- no caching');
    return exec.apply(this, arguments);
  }
  console.log('useCache: ', this.useCache);

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // Check if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key); // empty means no key

  // If we do, return data from cache
  if (cacheValue) {
    console.log('------');
    console.log('Reading data from redis');
    const doc = JSON.parse(cacheValue);
    // console.log('doc:', doc);
    // Convert the JSON result to a single model or array of models
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d)) // creates array of models
      : new this.model(doc); // returns a single model
  }

  console.log('reading data from mongo w/key --', this.hashKey + ':' + key);

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments); // executes the original

  console.log('------');
  console.log('preparing to write data to redis');

  // create cache entry for the data from Mongo using hashkey a nd key
  client.hset(this.hashKey, key, JSON.stringify(result));
  // console.log('result: ', result);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
