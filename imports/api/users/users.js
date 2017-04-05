import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Loads } from '../loads/loads.js';
import { AggLoads } from '../loads/loads.js';

import {simulate} from './methods.js'
import { drawConsumption } from '../loads/hourlyStats.js';

import { Schema } from '../schema.js';

const loadsDenormalizer = {
  afterInsertUser(userId, hasStore, hasGen) {
    const le = drawConsumption();
    const s = hasStore ? drawConsumption() : null;
    const g = hasGen ? drawConsumption() : null;
    Loads.insert({
      userId: userId,
      l: le,
      e: le,
      s: s,
      g: g,
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
  remove(selector, callback) {
    const result = super.remove(selector, callback);
    loadsDenormalizer.afterRemoveUser(selector);
  }
}

// export const Users = new UsersCollection('users'); // Server Collection
export const Users = new UsersCollection('users', { connection: null } ); // local Collection

Users.attachSchema(Schema.users);

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
