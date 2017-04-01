import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Loads } from '../loads/loads.js';

import {simulate} from '../methods.js'
import { drawConsumption } from '../loads/hourlyStats.js';

const loadsDenormalizer = {
  afterInsertUser(userId) {
    Loads.insert({
      userId: userId,
      e: drawConsumption()
    });
  }
};

class UsersCollection extends Mongo.Collection {
  insert(user, callback) {
    // Call the original `insert` method, which will validate against the schema
    const result = super.insert(user, callback);
    loadsDenormalizer.afterInsertUser(result);
    return result;
  }
  // THIS DOES NOT WORK FOR BULK REMOVAL YET
  // remove(selector, callback) {
  //   Loads.remove({userId: selector});
  //   return super.remove(selector, callback);
  // }
}

export const Users = new UsersCollection('users'); // Mongo server Collection
// export const Users = new UsersCollectionCollection(null); // local Collection

Schema = {};

Schema.users = new SimpleSchema({
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
});

Users.attachSchema(Schema.users);

Users.publicFields = {
  hasGen: 1,
  hasStore: 1,
};

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    return Users.find({fields: Users.publicFields});
  });
}
