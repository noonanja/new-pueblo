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
    Users.update({$or: [{hasStore: true}, {hasGen: true}]}, {$set: {hasStore: false, hasGen: false}}, { multi: true });
    const toConvert = Users.find({hasStore: false, hasGen: false}, {limit: Math.abs(userTypes[2])}).map(function(doc) {
      return doc._id;
    });
    Users.update({_id: {$in: toConvert.slice(0,  userTypes[0])}},           {$set: {hasStore: true,  hasGen: true}});
    Users.update({_id: {$in: toConvert.slice(userTypes[0], userTypes[1])}}, {$set: {hasStore: true,  hasGen: false}});
    Users.update({_id: {$in: toConvert.slice(userTypes[1], userTypes[2])}}, {$set: {hasStore: false, hasGen: true}});
  },
});


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
