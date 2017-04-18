import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from './users.js';
import { Loads } from '../loads/loads.js';
import { AggLoads } from '../aggLoads/aggLoads.js';
import { Console } from '../simulations/simulations.js';

import { Constraints } from '/lib/constraints.js';
import { Schema } from '../schema.js';


export const partition = new ValidatedMethod({
  name: 'users.partition',
  validate: new SimpleSchema({
    userTypes: {type: [Number]},
  }).validator(),
  run({userTypes}) {
    // reset all users to passive users
    const x = Users.update(
      { $or: [{hasStore: true}, {hasGen: true}] },
      {
        $set: {hasStore: false, hasGen: false},
      },
      { multi: true, }
    );
    console.log(x);

    // insert storer-generators
    const sgConvert = userTypes[0];
    addActive(sgConvert, true, true);

    // insert storers
    const sConvert = userTypes[1] - userTypes[0];
    addActive(sConvert, true, false);

    // insert generators
    const gConvert = userTypes[2] - userTypes[1];
    addActive(gConvert, false, true);

  },
});

const addActive = function(count, hasStore, hasGen) {
  if (count < 0) {
    throw new Meteor.Error('Can only create active users from addActive');
  }
  const toConvert = Users.find({hasStore: false, hasGen: false}, {limit: Math.abs(count)}).map(function(doc) {
    return doc._id;
  });
  toConvert.forEach(function(id) {
    Users.update({_id: id}, {$set: {hasStore: hasStore, hasGen: hasGen}});
  });
}

// Get list of all method names on simulations
const USERS_METHODS = _.pluck([
  partition,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 list operations per connection per 5 seconds
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(USERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 5000);
}
