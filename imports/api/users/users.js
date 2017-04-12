import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Loads } from '../loads/loads.js';
import { AggLoads } from '../loads/loads.js';

import { simulate } from './methods.js'
import { drawConsumption } from '../loads/hourlyStats.js';

import { Schema } from '../schema.js';

const loadsDenormalizer = {
  afterInsertUser(userId, hasStore, hasGen) {
    const le = drawConsumption();
    // Initialize active users with no storage/ generation strategies
    const s = hasStore ? Array.apply(null, Array(24)).map(Number.prototype.valueOf, 0) : null;
    const g = hasGen ? Array.apply(null, Array(24)).map(Number.prototype.valueOf, 0): null;
    Loads.insert({
      userId: userId,
      l: le,
      e: le,
      s: s,
      g: g,
    });
  },
  afterUpdateUser(selector, modifier) {
    Users.find(selector).forEach((user) => {
      const load = Loads.findOne({userId: user._id});
      Loads.remove(load._id);
      const s = user.hasStore ? Array.apply(null, Array(24)).map(Number.prototype.valueOf, 0) : null;
      const g = user.hasGen ? Array.apply(null, Array(24)).map(Number.prototype.valueOf, 0): null;
      Loads.insert({
        userId: user._id,
        l: load.e,
        e: load.e,
        s: s,
        g: g,
      });
    });
  },
  afterRemoveUser(selector) {
    Loads.remove({userId: selector._id});
  }
};

class UsersCollection extends Mongo.Collection {
  insert(user, callback) {
    // Call the original `insert` method, which will validate against the schema
    const result = super.insert(user, callback);
    loadsDenormalizer.afterInsertUser(result, user.hasStore, user.hasGen);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    loadsDenormalizer.afterUpdateUser(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    const result = super.remove(selector, callback);
    loadsDenormalizer.afterRemoveUser(selector);
  }
}

export const Users = new UsersCollection('users', { connection: null } ); // local Collection

Users.attachSchema(Schema.users);

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
