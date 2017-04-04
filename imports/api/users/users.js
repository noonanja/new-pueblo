import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Loads } from '../loads/loads.js';

import {simulate} from './methods.js'
import { drawConsumption } from '../loads/hourlyStats.js';

import { Schema } from '../schema.js';

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
  removeOne(user, callback) {
    load = Loads.findOne({userId: user._id});
    AggLoads.update(
      {active: (user.hasStore || user.hasGen) },
      {
        $inc: {
            n: -1,
            "l.h1":  -load.e.h1,  "l.h2":  -load.e.h2,  "l.h3":  -load.e.h3,  "l.h4":  -load.e.h4,
            "l.h5":  -load.e.h5,  "l.h6":  -load.e.h6,  "l.h7":  -load.e.h7,  "l.h8":  -load.e.h8,
            "l.h9":  -load.e.h9,  "l.h10": -load.e.h10, "l.h11": -load.e.h11, "l.h12": -load.e.h12,
            "l.h13": -load.e.h13, "l.h14": -load.e.h14, "l.h15": -load.e.h15, "l.h16": -load.e.h16,
            "l.h17": -load.e.h17, "l.h18": -load.e.h18, "l.h19": -load.e.h19, "l.h20": -load.e.h20,
            "l.h21": -load.e.h21, "l.h22": -load.e.h22, "l.h23": -load.e.h23, "l.h24": -load.e.h24,
        },
      }
    );
    Loads.remove(load);
    return super.remove(selector, callback);
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
